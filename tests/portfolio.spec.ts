import { expect, test, type Page } from '@playwright/test';

const openMobileMenuIfNeeded = async (page: Page) => {
    const viewport = page.viewportSize();
    if (!viewport || viewport.width >= 768) return;

    const openMenuButton = page.getByRole('button', { name: /打开菜单|open menu|menu/i }).first();
    if (await openMenuButton.isVisible()) {
        await openMenuButton.click();
    }
};

test.describe('Portfolio E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('home page should render key structure', async ({ page }) => {
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('#impact')).toBeVisible();
        await expect(page.locator('#experience')).toBeVisible();
        await expect(page.locator('#projects')).toBeVisible();
        await expect(page.locator('#contact')).toBeVisible();
    });

    test('resume download link should be valid', async ({ page }) => {
        const downloadLink = page.getByRole('link', { name: /下载|简历|resume|pdf/i }).first();
        await expect(downloadLink).toBeVisible();
        await expect(downloadLink).toHaveAttribute('href', /^\/(?:api\/resume(?:\?filename=.+)?|resume\.pdf)$/);
    });

    test('appointment modal should open and close with escape', async ({ page }) => {
        const appointmentButton = page.getByRole('button', { name: /预约|面谈|appointment|interview/i }).first();
        await expect(appointmentButton).toBeVisible();

        await appointmentButton.click();
        const modal = page.getByRole('dialog').first();
        await expect(modal).toBeVisible();

        await page.keyboard.press('Escape');
        await expect(modal).not.toBeVisible();
    });

    test('legacy editor entry points should not exist', async ({ page }) => {
        await expect(page.getByText(/导入\s*JSON|导出\s*JSON|编辑模式|Demo 模式|editor/i)).toHaveCount(0);
        await expect(page.locator('button', { hasText: /编辑|editor/i })).toHaveCount(0);
    });

    test.describe('Engineering Command Center', () => {
        test('should open and close with escape, and trap focus', async ({ page }) => {
            const openButton = page.getByRole('button', { name: /Engineering|工程实力中枢/i });
            await expect(openButton).toBeVisible();

            await openButton.click();
            const panelTitle = page.getByRole('heading', { name: /工程实力中枢|Engineering Command Center/i });
            await expect(panelTitle).toBeVisible();
            await expect(page.getByRole('heading', { name: /实时性能指标|Runtime Metrics/i })).toBeVisible();
            await expect(page.getByRole('heading', { name: /开源数据看板|Open Source Telemetry/i })).toBeVisible();
            await expect(page.getByRole('heading', { name: /工程指纹|Engineering Fingerprint/i })).toBeVisible();

            const closeButton = page.getByRole('button', { name: /关闭工程实力中枢|close/i });
            await expect(closeButton).toBeVisible();
            await expect(closeButton).toBeFocused();

            await page.keyboard.press('Escape');
            await expect(panelTitle).not.toBeVisible();
        });

        test('should render telemetry from github api response', async ({ page }) => {
            await page.route('**/api/github', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        followers: 42,
                        public_repos: 7,
                        totalStars: 123,
                        source: 'github-api',
                        isPartial: false,
                        message: '已通过 GitHub 接口获取实时数据。',
                        specificRepos: [
                            {
                                name: 'wechat-bot',
                                stars: 5,
                                url: 'https://github.com/icefunicu/wechat-bot',
                            },
                        ],
                    }),
                });
            });

            await page.getByRole('button', { name: /Engineering|工程实力中枢/i }).click();
            await expect(page.getByText('123')).toBeVisible();
            await expect(page.getByText('wechat-bot')).toBeVisible();
            await expect(page.getByText('★ 5')).toBeVisible();
        });

        test('should degrade gracefully when github api fails', async ({ page }) => {
            await page.route('**/api/github', async (route) => {
                await route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({ error: 'fail' }),
                });
            });

            await page.getByRole('button', { name: /Engineering|工程实力中枢/i }).click();
            await expect(page.getByRole('heading', { name: /工程实力中枢|Engineering Command Center/i })).toBeVisible();
            await expect(page.getByText(/GitHub 数据请求失败|GitHub 数据暂不可用|telemetry.*unavailable|failed/i)).toBeVisible();
        });
    });

    test('impact card should not auto-jump, and jump only when explicitly requested', async ({ page }) => {
        const impactSection = page.locator('#impact');
        await impactSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);

        const firstCard = page.locator('#impact button[aria-label]').first();
        await expect(firstCard).toBeVisible();
        await firstCard.click();

        const drawer = page.getByRole('dialog').first();
        await expect(drawer).toBeVisible();

        const jumpButton = page.getByRole('button', { name: /定位到对应经历/i });
        await expect(jumpButton).toBeVisible();

        const experienceSection = page.locator('#experience');
        await expect(experienceSection).not.toBeInViewport();

        await jumpButton.evaluate((el: HTMLButtonElement) => el.click());
        await page.waitForTimeout(400);
        await expect(experienceSection).toBeInViewport();
    });

    test('navigation should scroll to target section', async ({ page }) => {
        await openMobileMenuIfNeeded(page);

        const navRoot = page.locator('nav').first();
        const contactNav = navRoot
            .getByRole('button', { name: /联系|contact/i })
            .or(navRoot.getByRole('link', { name: /联系|contact/i }))
            .first();

        await expect(contactNav).toBeVisible();
        await expect(contactNav).toBeEnabled();

        await contactNav.click();
        try {
            await expect(page.locator('#contact')).toBeInViewport({ timeout: 5000 });
        } catch {
            await contactNav.click();
            await expect(page.locator('#contact')).toBeInViewport({ timeout: 10000 });
        }
    });

    test('scroll progress bar should be visible after scrolling (desktop)', async ({ page }) => {
        const viewport = page.viewportSize();
        test.skip(!viewport || viewport.width < 768, 'desktop only');

        await page.evaluate(() => window.scrollTo(0, 600));
        await page.waitForTimeout(250);
        await expect(page.locator('[role="progressbar"]')).toBeVisible();
    });
});
