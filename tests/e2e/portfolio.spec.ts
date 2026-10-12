import { expect, test, type Page } from '@playwright/test';

const RESUME_FILE_NAME = '\u675c\u65ed\u5609_AI\u5e94\u7528\u5de5\u7a0b\u5e08_15035925107.pdf';
const RESUME_FILE_PATH = `/${encodeURIComponent(RESUME_FILE_NAME)}`;
const EN_RESUME_FILE_NAME = 'du-xujia-ai-application-engineer.pdf';

const openMobileMenuIfNeeded = async (page: Page) => {
    const viewport = page.viewportSize();
    if (!viewport || viewport.width >= 768) return;

    const contactLink = page.locator('nav').first().getByRole('link', { name: /联系|contact/i }).first();
    if (await contactLink.isVisible().catch(() => false)) {
        return;
    }

    const openMenuButton = page.getByRole('button', { name: /打开菜单|open menu/i }).first();
    await expect(openMenuButton).toBeVisible({ timeout: 5000 });
    await expect(openMenuButton).toBeEnabled();
    const mobileMenu = page.locator('#dark-mobile-menu');
    if (await mobileMenu.isVisible().catch(() => false)) return;
    await openMenuButton.click();
    await expect(mobileMenu).toBeVisible({ timeout: 5000 });
};

const scrollSectionIntoView = async (page: Page, selector: string) => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
            const section = page.locator(selector).first();
            await expect(section).toBeVisible({ timeout: 5000 });
            await section.evaluate((element: HTMLElement) => {
                const sectionId = element.id;
                if (sectionId) {
                    (window as Window & { __portfolioRequestedSection?: string }).__portfolioRequestedSection =
                        sectionId;
                    window.dispatchEvent(
                        new CustomEvent('portfolio:section-request', {
                            detail: { id: sectionId },
                        }),
                    );
                }
                element.scrollIntoView({ behavior: 'auto', block: 'start' });
            });
            await waitForSectionToReachViewport(page, selector, 8000);
            return;
        } catch (error) {
            if (attempt === 2) {
                throw error;
            }
            await page.waitForTimeout(240);
        }
    }
};

const gotoHomePage = async (page: Page) => {
    const homeHeading = page.getByRole('heading', { level: 1 });

    for (let attempt = 0; attempt < 3; attempt += 1) {
        await page.goto('/');

        try {
            await expect(homeHeading).toBeVisible({ timeout: 8000 });
            return;
        } catch (error) {
            const notFoundHeading = page.getByRole('heading', { level: 1, name: '404' });
            if (attempt === 2 || !(await notFoundHeading.isVisible().catch(() => false))) {
                throw error;
            }
            await page.waitForTimeout(400);
        }
    }
};

const gotoLocalizedHomePage = async (page: Page, path: '/zh' | '/en') => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 8000 });
};

const waitForSectionToReachViewport = async (
    page: Page,
    selector: string,
    timeout = 10000,
) => {
    await expect
        .poll(
            async () =>
                page.evaluate((targetSelector) => {
                    const section = document.querySelector<HTMLElement>(targetSelector);
                    if (!section) return false;

                    const rect = section.getBoundingClientRect();
                    return rect.top < window.innerHeight && rect.bottom > 0;
                }, selector),
            {
                timeout,
                interval: 150,
            },
        )
        .toBe(true);
};

test.describe('Portfolio E2E', () => {
    test.beforeEach(async ({ page }) => {
        await gotoHomePage(page);
    });

    test('home page should render key structure', async ({ page }) => {
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('#impact')).toBeVisible();
        await expect(page.locator('#experience')).toBeVisible();
        await expect(page.locator('#featured-projects')).toBeVisible();
        await expect(page.locator('#capability-summary')).toBeVisible();
        await expect(page.locator('#projects')).toBeVisible();
        await expect(page.locator('#contact')).toBeVisible();
    });

    test('layout should avoid horizontal overflow', async ({ page }) => {
        const hasOverflow = await page.evaluate(() => {
            const root = document.documentElement;
            return root.scrollWidth - root.clientWidth > 1;
        });

        expect(hasOverflow).toBeFalsy();
    });

    test('hero should present positioning and evidence guidance', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1, name: '杜旭嘉' })).toBeVisible();
        await expect(page.getByRole('heading', { level: 2, name: 'AI Agent / FDE 工程师' })).toBeVisible();
        await expect(page.getByText('AI Agent 产品化').first()).toBeVisible();
        await expect(page.getByText('FDE 现场交付').first()).toBeVisible();
        await expect(page.getByText('传统行业 AI 化').first()).toBeVisible();
        await expect(page.getByRole('link', { name: /查看项目证据|project evidence/i })).toHaveAttribute('href', '#projects');
        await expect(page.getByText('以上指标均可在项目详情与仓库中复核。')).toBeVisible();
    });

    test('resume download link should be valid', async ({ page }) => {
        const downloadLink = page.getByRole('link', { name: /下载|简历|resume|pdf/i }).first();
        await expect(downloadLink).toBeVisible();
        await expect(downloadLink).toHaveAttribute('download', RESUME_FILE_NAME);

        const href = await downloadLink.getAttribute('href');
        expect(href === '/api/resume' || href === RESUME_FILE_PATH).toBeTruthy();
    });

    test('localized home pages should render zh and en content', async ({ page }) => {
        await gotoLocalizedHomePage(page, '/zh');
        await expect(page.getByText('AI Agent 产品化').first()).toBeVisible();

        await gotoLocalizedHomePage(page, '/en');
        await expect(page.getByText('Agent productization').first()).toBeVisible();
        await expect(page.getByRole('link', { name: /download resume/i }).first()).toHaveAttribute(
            'download',
            EN_RESUME_FILE_NAME,
        );
    });

    test('language switch should preserve context via explicit locale routes', async ({ page }) => {
        await gotoLocalizedHomePage(page, '/zh');
        const switchToEnglish = page.locator('nav').getByRole('link', { name: /English/i }).first();
        await expect(switchToEnglish).toBeVisible();
        await switchToEnglish.click();
        await expect(page).toHaveURL(/\/en(?:[#?].*)?$/);

        const switchToChinese = page
            .locator('nav')
            .getByRole('link', { name: /switch to chinese|中文/i })
            .first();
        await expect(switchToChinese).toBeVisible();
        await switchToChinese.click();
        await expect(page).toHaveURL(/\/zh(?:[#?].*)?$/);
    });

    test('experience section should render the parent role and its project evidence', async ({ page }) => {
        await scrollSectionIntoView(page, '#experience');

        const experienceSection = page.locator('#experience');
        await expect(experienceSection.getByText('独立开发者').first()).toBeVisible();
        await expect(experienceSection.getByText('项目名称 / 实践场景')).toBeVisible();
        await expect(experienceSection.getByText('简租科技小程序（RentBox）', { exact: true })).toBeVisible();
        await expect(experienceSection.getByText('数阁科技（深圳）｜论文检索任务平台', { exact: true })).toBeVisible();
        await expect(experienceSection.getByText('数阁科技（深圳）｜IPA 方言语音转写原型', { exact: true })).toBeVisible();
        await expect(experienceSection.getByText('智能客服运行时', { exact: true })).toBeVisible();
        await expect(experienceSection.getByText('微信智能助手', { exact: true })).toBeVisible();
        await expect(experienceSection.getByText('技术栈：Java 21 / Spring Boot 3.5 / MySQL / Redis')).toBeVisible();

        const parentOutcomes = experienceSection.locator('.reboot-timeline-row').first().locator('.reboot-timeline-outcomes li');
        await expect(parentOutcomes).toHaveCount(3);

        const projectCards = experienceSection.locator('.reboot-child-project');
        await expect(projectCards).toHaveCount(5);
        for (const card of await projectCards.all()) {
            await expect(card.locator('.reboot-child-outcomes li')).toHaveCount(3);
        }
    });

    test('hero project evidence cta should reveal the project evidence section', async ({ page }) => {
        const projectEvidenceLink = page.getByRole('link', { name: /查看项目证据|project evidence/i }).first();
        await expect(projectEvidenceLink).toBeVisible();
        await expect(projectEvidenceLink).toHaveAttribute('href', '#projects');
        await projectEvidenceLink.click();

        await expect(page).toHaveURL(/#projects$/);
        await waitForSectionToReachViewport(page, '#projects', 9000);
    });

    test('experience should appear before impact and projects in document order', async ({ page }) => {
        const sectionOffsets = await page.evaluate(() => {
            const ids = ['experience', 'impact', 'featured-projects', 'projects'] as const;
            return Object.fromEntries(
                ids.map((id) => [
                    id,
                    document.getElementById(id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY,
                ]),
            );
        });

        expect(sectionOffsets.experience).toBeLessThan(sectionOffsets.impact);
        expect(sectionOffsets.impact).toBeLessThan(sectionOffsets['featured-projects']);
        expect(sectionOffsets['featured-projects']).toBeLessThan(sectionOffsets.projects);
    });

    test('scroll progress should provide quick jumps into the reboot sections', async ({ page }) => {
        const progressNav = page.locator('.reboot-progress');
        await expect(progressNav).toBeVisible();
        await expect(progressNav.locator('a')).toHaveCount(4);

        const workEntry = progressNav.locator('a[href="#featured-projects"]');
        await expect(workEntry).toBeVisible();
        await workEntry.click();
        await waitForSectionToReachViewport(page, '#featured-projects', 8000);
    });

    test('about and audience quick-entry sections should not render', async ({ page }) => {
        await expect(page.locator('#about')).toHaveCount(0);
        await expect(page.locator('#audience')).toHaveCount(0);
        await expect(page.getByRole('heading', { name: '你可以快速怎么读我' })).toHaveCount(0);
        await expect(page.getByRole('heading', { name: '按角色快速进入' })).toHaveCount(0);
        await expect(page.getByRole('button', { name: /HR\s*快速路径/i })).toHaveCount(0);
        await expect(page.getByRole('button', { name: /客户\s*快速路径/i })).toHaveCount(0);
    });

    test('legacy editor entry points should not exist', async ({ page }) => {
        await expect(page.getByText(/导入\s*JSON|导出\s*JSON|编辑模式|Demo 模式|editor/i)).toHaveCount(0);
        await expect(page.locator('button', { hasText: /编辑|editor/i })).toHaveCount(0);
    });

    test('impact cards should open an accessible evidence drawer', async ({ page }) => {
        await scrollSectionIntoView(page, '#impact');
        await page.waitForTimeout(150);

        const firstCard = page.locator('#impact button[aria-label]').first();
        await expect(firstCard).toBeVisible();
        await firstCard.click();

        const drawer = page.getByRole('dialog').first();
        await expect(drawer).toBeVisible();
        const closeButton = drawer.getByRole('button', { name: /关闭.*面板|关闭/i }).first();
        await expect(closeButton).toBeVisible();
        await expect(closeButton).toBeFocused();
        await expect(drawer.getByText(/证据来源|Evidence source|概述|Overview/i).first()).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(drawer).not.toBeVisible();
    });

    test('navigation should open the contact entry page', async ({ page }) => {
        await openMobileMenuIfNeeded(page);

        const viewport = page.viewportSize();
        const navRoot = page.locator('nav').first();
        const contactNav = viewport && viewport.width < 768
            ? page.locator('#dark-mobile-menu').getByRole('link', { name: /联系|contact/i }).first()
            : navRoot.getByRole('link', { name: /联系|contact/i }).first();

        await expect(contactNav).toBeVisible();
        await expect(contactNav).toBeEnabled();

        await contactNav.click();
        await expect(page).toHaveURL(/\/(?:about)?#contact$/);
        await expect(page.locator('#contact')).toBeVisible();
    });

    test('contact private channels should be reveal-on-demand', async ({ page }) => {
        await scrollSectionIntoView(page, '#contact');

        await expect(page.getByText('15035925107')).toHaveCount(0);
        const revealButton = page.getByRole('button', { name: /展开更多联系方式/i });
        await expect(revealButton).toBeVisible();
        await revealButton.click();

        try {
            await expect(page.getByText('15035925107')).toBeVisible({ timeout: 3000 });
        } catch {
            await revealButton.evaluate((el: HTMLButtonElement) => el.click());
            await expect(page.getByText('15035925107')).toBeVisible({ timeout: 5000 });
        }
        await expect(page.getByText('w2041487752')).toBeVisible();
    });

    test('featured projects should present summaries, capability and technical structure', async ({ page }) => {
        await scrollSectionIntoView(page, '#featured-projects');

        await expect(page.getByText('功能描述').first()).toBeVisible();
        await expect(page.getByText('技术描述').first()).toBeVisible();
        await expect(page.getByRole('link', { name: /查看案例拆解/i }).first()).toBeVisible();
    });

    test('featured projects should render story sections inline without collapsing', async ({ page }) => {
        await scrollSectionIntoView(page, '#featured-projects');

        const firstProjectCard = page.locator('#featured-projects article').first();
        await expect(
            firstProjectCard.getByText(/功能描述|Capability breakdown/i).first(),
        ).toBeVisible();
        await expect(
            firstProjectCard.locator('.reboot-project-details').first(),
        ).toBeVisible();
    });

    test('inner pages should share the reboot shell and remain navigable', async ({ page }) => {
        for (const path of ['/projects', '/experience', '/about', '/experiences/proj-rag-qa-system']) {
            await page.goto(path);
            await expect(page.locator('.dark-portfolio.reboot-page.reboot-inner-page')).toBeVisible();
            await expect(page.locator('h1').first()).toBeVisible();
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
            expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
        }
    });

    test('theme toggle should switch the reboot shell without navigation', async ({ page }) => {
        const toggle = page.locator('.reboot-icon-button').first();
        await expect(toggle).toBeVisible();
        await expect(toggle).toHaveAttribute('aria-label', /切换到浅色模式|switch to light mode/i);
        await toggle.click({ noWaitAfter: true });
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
        await expect(page.locator('.dark-portfolio.reboot-page')).toBeVisible();
        await toggle.click({ noWaitAfter: true });
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });

    test('mobile scroll progress dock should stay compact after scroll', async ({ page }) => {
        const viewport = page.viewportSize();
        test.skip(!viewport || viewport.width >= 768, 'mobile only');

        await page.evaluate(() => window.scrollTo(0, 720));
        const progressDock = page.locator('.reboot-progress');
        await expect(progressDock).toBeVisible();

        const dockBox = await progressDock.boundingBox();
        expect(dockBox).not.toBeNull();
        expect(dockBox!.height).toBeLessThanOrEqual(96);
    });

    test('scroll progress dock should support back to top (desktop)', async ({ page }) => {
        const viewport = page.viewportSize();
        test.skip(!viewport || viewport.width < 768, 'desktop only');

        await page.evaluate(() => window.scrollTo(0, 600));
        const progress = page.locator('.reboot-progress');
        await expect(progress).toBeVisible();
        await expect(progress.locator('.reboot-progress-fill')).toHaveAttribute('style', /scaleY/);
        await progress.locator('a[href="#hero"]').click();
        await expect
            .poll(async () => page.evaluate(() => window.scrollY), { timeout: 5000 })
            .toBeLessThan(40);
    });
});
