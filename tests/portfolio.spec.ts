import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test.describe('Hero Section', () => {
        test('should load hero section with correct content', async ({ page }) => {
            // Wait for hero to be visible
            await expect(page.locator('section').first()).toBeVisible();

            // Check for value proposition
            await expect(page.getByText('打造高性能、可访问的全栈产品')).toBeVisible();

            // Check for name/title
            await expect(page.locator('h1')).toBeVisible();
        });

        test('should have working resume download button', async ({ page }) => {
            const downloadButton = page.getByRole('link', { name: /下载 PDF 简历/i });
            await expect(downloadButton).toBeVisible();

            // Check href points to resume.pdf
            await expect(downloadButton).toHaveAttribute('href', '/resume.pdf');
        });

        test('should open appointment modal on CTA click', async ({ page }) => {
            const appointmentButton = page.getByRole('button', { name: /预约面谈/i });
            await expect(appointmentButton).toBeVisible();

            // Click the button
            await appointmentButton.click();

            // Modal should appear
            const modal = page.getByRole('dialog');
            await expect(modal).toBeVisible();

            // Check modal has form fields (scope to modal to avoid conflicts with Contact section)
            await expect(modal.getByLabel(/您的姓名|姓名/i)).toBeVisible();
            await expect(modal.getByLabel(/您的邮箱|邮箱地址/i)).toBeVisible();
        });
    });

    test.describe('Appointment Modal', () => {
        test('should close modal on escape key', async ({ page }) => {
            // Open modal
            await page.getByRole('button', { name: /预约面谈/i }).click();
            await expect(page.getByRole('dialog')).toBeVisible();

            // Press escape
            await page.keyboard.press('Escape');

            // Modal should be hidden
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('should close modal on close button click', async ({ page }) => {
            // Open modal
            await page.getByRole('button', { name: /预约面谈/i }).click();
            await expect(page.getByRole('dialog')).toBeVisible();

            // Click close button
            await page.getByRole('button', { name: /关闭/i }).click();

            // Modal should be hidden
            await expect(page.getByRole('dialog')).not.toBeVisible();
        });

        test('should validate form fields', async ({ page }) => {
            // Open modal
            await page.getByRole('button', { name: /预约面谈/i }).click();

            // Try to submit empty form
            const submitButton = page.getByRole('button', { name: /发送预约请求/i });
            await submitButton.click();

            // Name field should show validation error (required)
            const nameInput = page.getByLabel(/姓名/i);
            await expect(nameInput).toHaveAttribute('required');
        });
    });

    test.describe('Navigation', () => {
        test('should have working navigation links', async ({ page }) => {
            // Check navbar is visible
            const navbar = page.locator('nav');
            await expect(navbar).toBeVisible();

            // Check for navigation items
            await expect(page.getByRole('button', { name: /量化成果|职业履历|技术栈|联系我/i }).first()).toBeVisible();
        });

        test('should scroll to sections on nav click', async ({ page }) => {
            // Click on a navigation link
            await page.getByRole('button', { name: /联系我/i }).click();

            // Wait for scroll
            await page.waitForTimeout(500);

            // Contact section should be in view
            const contactSection = page.locator('#contact');
            await expect(contactSection).toBeInViewport();
        });
    });

    test.describe('Scroll Progress', () => {
        test('should show scroll progress bar', async ({ page }) => {
            // Scroll down the page
            await page.evaluate(() => window.scrollTo(0, 500));

            // Wait for animation
            await page.waitForTimeout(300);

            // Progress bar should be visible (on desktop)
            const viewport = page.viewportSize();
            if (viewport && viewport.width >= 768) {
                const progressBar = page.locator('[role="progressbar"]');
                await expect(progressBar).toBeVisible();
            }
        });
    });

    test.describe('Accessibility', () => {
        test('should have proper heading structure', async ({ page }) => {
            // Check for h1
            const h1 = page.locator('h1');
            await expect(h1).toHaveCount(1);

            // Check for h2s
            const h2s = page.locator('h2');
            expect(await h2s.count()).toBeGreaterThan(0);
        });

        test('should have proper focus visible styles', async ({ page }) => {
            // Tab to first focusable element
            await page.keyboard.press('Tab');

            // Check that focus is visible
            const focusedElement = page.locator(':focus-visible');
            await expect(focusedElement).toBeVisible();
        });

        test('CTAs should have minimum touch target size', async ({ page }) => {
            const downloadButton = page.getByRole('link', { name: /下载 PDF 简历/i });
            const boundingBox = await downloadButton.boundingBox();

            // Minimum 44x44dp touch target
            expect(boundingBox?.width).toBeGreaterThanOrEqual(44);
            expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
        });
    });
});
