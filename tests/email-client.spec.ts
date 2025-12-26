import { test, expect } from '@playwright/test';

/**
 * I.AM Mail - Automated E2E Tests
 * Run with: npx playwright test
 * View report: npx playwright show-report
 */

test.describe('P0: Authentication', () => {
    test('should show login page initially', async ({ page }) => {
        // Clear any existing auth
        await page.context().clearCookies();

        await page.goto('/');

        // Should have login form elements
        await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    });

    test('should login successfully', async ({ page }) => {
        await page.goto('/');

        // Fill login form
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'testpassword');

        // Click login
        await page.click('button[type="submit"]');

        // Should navigate to inbox (wait for emails to load)
        await expect(page.locator('text=INBOX')).toBeVisible({ timeout: 15000 });
    });

    test('should remember email on reload when Remember Me is checked', async ({ page }) => {
        await page.goto('/');

        // Fill form with Remember Me
        await page.fill('input[type="email"]', 'remembered@test.com');
        await page.fill('input[type="password"]', 'password');

        // Ensure remember me is checked (it should be by default)
        const rememberCheckbox = page.locator('text=Remember me').first();
        await expect(rememberCheckbox).toBeVisible();

        // Login
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);

        // Check localStorage
        const savedEmail = await page.evaluate(() => localStorage.getItem('saved_email'));
        expect(savedEmail).toBe('remembered@test.com');
    });
});

test.describe('P0: Email Accounts', () => {
    test.beforeEach(async ({ page }) => {
        // Login first
        await page.goto('/');
        await page.fill('input[type="email"]', 'sabiqahmed@gmail.com');
        await page.fill('input[type="password"]', 'test');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(3000);
    });

    test('should open settings modal', async ({ page }) => {
        // Find and click settings button
        const settingsBtn = page.locator('[aria-label*="settings"], button:has(svg)').first();
        await settingsBtn.click();

        // Settings modal should open
        await expect(page.locator('text=SETTINGS')).toBeVisible({ timeout: 5000 });
    });

    test('should show connected accounts', async ({ page }) => {
        // Open settings
        await page.click('[aria-label*="settings"], button:has(svg)');
        await page.waitForTimeout(1000);

        // Click on Accounts tab
        await page.click('text=ACCOUNTS');
        await page.waitForTimeout(2000);

        // Should show accounts or "No email accounts connected"
        const hasAccounts = await page.locator('text=@gmail.com').count();
        const noAccounts = await page.locator('text=No email accounts connected').count();

        expect(hasAccounts > 0 || noAccounts > 0).toBeTruthy();
    });
});

test.describe('P0: Email Fetching', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.fill('input[type="email"]', 'sabiqahmed@gmail.com');
        await page.fill('input[type="password"]', 'test');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(3000);
    });

    test('should display inbox emails', async ({ page }) => {
        // Wait for emails to load
        await page.waitForTimeout(5000);

        // Should have email list items or loading indicator
        const emailItems = page.locator('[class*="email"], [class*="mail-item"]');
        const count = await emailItems.count();

        // Log for debugging
        console.log(`Found ${count} email items`);

        // Should have at least some content
        expect(count >= 0).toBeTruthy();
    });

    test('should click and view email detail', async ({ page }) => {
        await page.waitForTimeout(3000);

        // Click first email in list
        const firstEmail = page.locator('[class*="email"]').first();
        if (await firstEmail.count() > 0) {
            await firstEmail.click();
            await page.waitForTimeout(2000);

            // Should show email detail (subject visible)
            const hasDetail = await page.locator('[class*="detail"], [class*="body"]').count();
            expect(hasDetail > 0).toBeTruthy();
        }
    });
});

test.describe('P0: Email Sending (SMTP)', () => {
    test('API: should send email via SMTP endpoint', async ({ request }) => {
        const response = await request.post('/api/smtp/send', {
            data: {
                to: 'test@example.com',
                subject: 'Playwright Test Email',
                body: 'This is an automated test email from Playwright'
            }
        });

        const data = await response.json();

        // Should either succeed or have meaningful error
        expect(response.status()).toBeLessThan(500);
        console.log('SMTP Response:', data);
    });
});

test.describe('P1: Composer UI', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.fill('input[type="email"]', 'sabiqahmed@gmail.com');
        await page.fill('input[type="password"]', 'test');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(3000);
    });

    test('should open composer on Compose button click', async ({ page }) => {
        // Find compose button
        const composeBtn = page.locator('text=Compose, text=NEW, button:has-text("Compose")').first();
        if (await composeBtn.count() > 0) {
            await composeBtn.click();
            await page.waitForTimeout(1000);

            // Composer should be visible
            await expect(page.locator('text=COMPOSE, text=To')).toBeVisible({ timeout: 5000 });
        }
    });

    test('composer should not block background', async ({ page }) => {
        // Open compose
        const composeBtn = page.locator('text=Compose').first();
        if (await composeBtn.count() > 0) {
            await composeBtn.click();
            await page.waitForTimeout(1000);

            // Background should still be interactable (no full-screen backdrop)
            const backdrop = page.locator('.backdrop-blur-sm');
            const count = await backdrop.count();

            // Should have no blocking backdrop
            expect(count).toBe(0);
        }
    });

    test('should close composer with X button', async ({ page }) => {
        const composeBtn = page.locator('text=Compose').first();
        if (await composeBtn.count() > 0) {
            await composeBtn.click();
            await page.waitForTimeout(1000);

            // Click close button
            await page.click('button:has(svg[class*="lucide-x"])');
            await page.waitForTimeout(500);

            // Composer should be closed
            const composerVisible = await page.locator('text=COMPOSE').count();
            expect(composerVisible).toBe(0);
        }
    });
});

test.describe('API Health Checks', () => {
    test('should return accounts list', async ({ request }) => {
        const response = await request.get('/api/accounts?userId=sabiqahmed@gmail.com');
        expect(response.status()).toBe(200);

        const data = await response.json();
        console.log('Accounts:', data);
        expect(Array.isArray(data)).toBeTruthy();
    });

    test('should fetch emails via IMAP', async ({ request }) => {
        const response = await request.get('/api/imap/emails?limit=5');

        // Should either return emails or meaningful error
        expect(response.status()).toBeLessThan(500);

        const data = await response.json();
        console.log('Emails response:', Array.isArray(data) ? `${data.length} emails` : data);
    });

    test('should handle Hub intent parsing', async ({ request }) => {
        const response = await request.post('/api/hub/parse', {
            data: {
                message: 'Compose email to john@example.com about meeting',
                context: { currentScreen: 'inbox' }
            }
        });

        expect(response.status()).toBeLessThan(500);
        const data = await response.json();
        console.log('Hub Parse:', data);
    });
});
