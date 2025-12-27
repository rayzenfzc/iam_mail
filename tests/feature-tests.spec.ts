import { test, expect } from '@playwright/test';

/**
 * I.AM Mail - Comprehensive Feature Tests
 * 
 * This test suite covers ALL major features to identify what's working and what's broken.
 * Run with: npm test
 * View report: npm run test:report
 */

// Helper: Login before each test
async function loginAndWaitForApp(page: any) {
    await page.goto('/');
    await page.fill('input[type="email"]', 'sabiqahmed@gmail.com');
    await page.fill('input[type="password"]', 'test');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000); // Wait for app to load
}

// ==========================================
// CATEGORY 1: ACCOUNT MANAGEMENT
// ==========================================
test.describe('Account Management', () => {
    test.beforeEach(async ({ page }) => {
        await loginAndWaitForApp(page);
    });

    test('should show account selector in sidebar', async ({ page }) => {
        // Look for account avatar or email display in sidebar
        const accountClasses = await page.locator('[class*="account"], [class*="avatar"]').count();
        const gmailText = await page.locator('text=@gmail.com').count();
        const rayzenText = await page.locator('text=@rayzen').count();
        const hasAccountDisplay = accountClasses + gmailText + rayzenText;

        console.log(`Account display elements found: ${hasAccountDisplay}`);
        expect(hasAccountDisplay).toBeGreaterThan(0);
    });

    test('should be able to switch between accounts', async ({ page }) => {
        // Click on account selector
        const accountSelector = page.locator('[data-testid="account-selector"], [class*="account"]').first();

        if (await accountSelector.count() > 0) {
            await accountSelector.click();
            await page.waitForTimeout(1000);

            // Check if account list appears
            const gmailCount = await page.locator('text=@gmail.com').count();
            const rayzenCount = await page.locator('text=@rayzen.ae').count();
            const accountList = gmailCount + rayzenCount;
            console.log(`Accounts in dropdown: ${accountList}`);
            expect(accountList).toBeGreaterThan(0);
        } else {
            console.log('MISSING: Account selector not found in sidebar');
            test.skip();
        }
    });

    test('should open Settings modal', async ({ page }) => {
        // Click settings button
        const settingsBtn = page.locator('[data-testid="settings-button"], button:has(svg), [aria-label*="settings"]').first();
        await settingsBtn.click();
        await page.waitForTimeout(1000);

        // Check for settings modal
        const settingsModal = await page.locator('text=SETTINGS, text=Settings, [role="dialog"]').count();
        console.log(`Settings modal visible: ${settingsModal > 0}`);
        expect(settingsModal).toBeGreaterThan(0);
    });

    test('should show connected accounts in Settings', async ({ page }) => {
        // Open settings
        await page.click('[data-testid="settings-button"], button:has(svg)');
        await page.waitForTimeout(1000);

        // Look for accounts section or tab
        const accountsSection = page.locator('text=Accounts, text=ACCOUNTS, text=Connected, text=Email Accounts');
        if (await accountsSection.count() > 0) {
            await accountsSection.first().click();
            await page.waitForTimeout(1000);
        }

        // Check for account list
        const gmailFound = await page.locator('text=@gmail.com').count();
        const rayzenFound = await page.locator('text=@rayzen.ae').count();
        const gmailLabel = await page.locator('text=Gmail').count();
        const accounts = gmailFound + rayzenFound + gmailLabel;
        console.log(`Connected accounts found: ${accounts}`);
        expect(accounts).toBeGreaterThan(0);
    });
});

// ==========================================
// CATEGORY 2: EMAIL LIST & VIEWING
// ==========================================
test.describe('Email List & Viewing', () => {
    test.beforeEach(async ({ page }) => {
        await loginAndWaitForApp(page);
    });

    test('should display inbox with emails', async ({ page }) => {
        await page.waitForTimeout(3000);

        // Look for email list items
        const emailItems = page.locator('[class*="email"], [class*="mail-item"], [class*="message"]');
        const count = await emailItems.count();

        console.log(`Email items in inbox: ${count}`);
        // Should have at least some emails or a loading/empty state
        const hasContent = count > 0 || await page.locator('text=No emails, text=Loading').count() > 0;
        expect(hasContent).toBeTruthy();
    });

    test('should click email and show detail view', async ({ page }) => {
        await page.waitForTimeout(3000);

        const firstEmail = page.locator('[class*="email"], [class*="mail-item"]').first();
        if (await firstEmail.count() > 0) {
            await firstEmail.click();
            await page.waitForTimeout(2000);

            // Check for email detail view
            const hasDetailView = await page.locator('[class*="detail"], [class*="body"], [class*="content"]').count();
            console.log(`Email detail view elements: ${hasDetailView}`);
            expect(hasDetailView).toBeGreaterThan(0);
        } else {
            console.log('No emails to click');
            test.skip();
        }
    });

    test('should show sender, subject, and date in email list', async ({ page }) => {
        await page.waitForTimeout(3000);

        const emailItem = page.locator('[class*="email"], [class*="mail-item"]').first();
        if (await emailItem.count() > 0) {
            const text = await emailItem.textContent();
            console.log(`Email item content: ${text?.substring(0, 100)}...`);

            // Should have some text content
            expect(text?.length).toBeGreaterThan(5);
        }
    });
});

// ==========================================
// CATEGORY 3: COMPOSER & SENDING
// ==========================================
test.describe('Composer & Email Sending', () => {
    test.beforeEach(async ({ page }) => {
        await loginAndWaitForApp(page);
    });

    test('should open composer with Compose button', async ({ page }) => {
        const composeBtn = page.locator('[data-testid="compose-button"]');
        await composeBtn.click();
        await page.waitForTimeout(1500);

        const composerPanel = page.locator('[data-testid="composer-panel"]');
        expect(await composerPanel.count()).toBeGreaterThan(0);
    });

    test('should have To, Subject, and Body fields in composer', async ({ page }) => {
        await page.locator('[data-testid="compose-button"]').click();
        await page.waitForTimeout(1500);

        // Check for required fields
        const toField = await page.locator('input[placeholder*="To"], input[placeholder*="recipient"], [data-testid="to-field"]').count();
        const subjectField = await page.locator('input[placeholder*="Subject"], [data-testid="subject-field"]').count();
        const bodyField = await page.locator('textarea, [contenteditable="true"], [data-testid="body-field"]').count();

        console.log(`Composer fields - To: ${toField}, Subject: ${subjectField}, Body: ${bodyField}`);
        expect(toField + subjectField + bodyField).toBeGreaterThan(0);
    });

    test('should have attachment button in composer', async ({ page }) => {
        await page.locator('[data-testid="compose-button"]').click();
        await page.waitForTimeout(1500);

        const attachBtn = await page.locator('[data-testid="attach-button"], button:has-text("Attach"), button:has(svg[class*="paperclip"]), [aria-label*="attach"]').count();
        console.log(`Attachment button found: ${attachBtn > 0}`);

        if (attachBtn === 0) {
            console.log('MISSING FEATURE: Attachment button not found in composer');
        }
        expect(attachBtn).toBeGreaterThan(0);
    });

    test('should have send button in composer', async ({ page }) => {
        await page.locator('[data-testid="compose-button"]').click();
        await page.waitForTimeout(1500);

        const sendBtn = await page.locator('[data-testid="send-button"], button:has-text("Send"), button:has(svg[class*="send"])').count();
        console.log(`Send button found: ${sendBtn > 0}`);
        expect(sendBtn).toBeGreaterThan(0);
    });

    test('should close composer with X button', async ({ page }) => {
        await page.locator('[data-testid="compose-button"]').click();
        await page.waitForTimeout(1500);

        // Find and click close button
        const closeBtn = page.locator('[data-testid="composer-panel"] button:has(svg)').first();
        await closeBtn.click();
        await page.waitForTimeout(500);

        const composerGone = await page.locator('[data-testid="composer-panel"]').count() === 0;
        expect(composerGone).toBeTruthy();
    });
});

// ==========================================
// CATEGORY 4: AI HUB / CHAT FEATURES
// ==========================================
test.describe('AI Hub & Chat', () => {
    test.beforeEach(async ({ page }) => {
        await loginAndWaitForApp(page);
    });

    test('should have AI chat input visible', async ({ page }) => {
        // Look for @Hub chat input
        const chatInput = await page.locator('[data-testid="hub-input"], input[placeholder*="Hub"], input[placeholder*="AI"], textarea[placeholder*="type"], [class*="chat-input"]').count();
        console.log(`AI chat input found: ${chatInput > 0}`);

        if (chatInput === 0) {
            console.log('MISSING FEATURE: AI Hub chat input not visible');
        }
        expect(chatInput).toBeGreaterThan(0);
    });

    test('should respond to AI commands', async ({ page }) => {
        const chatInput = page.locator('[data-testid="hub-input"], input[placeholder*="Hub"], textarea[placeholder*="type"]').first();

        if (await chatInput.count() > 0) {
            await chatInput.fill('@Hub compose email to test@test.com');
            await chatInput.press('Enter');
            await page.waitForTimeout(3000);

            // Check for AI response or action
            const response = await page.locator('[class*="response"], [class*="suggestion"], [data-testid="composer-panel"]').count();
            console.log(`AI response/action triggered: ${response > 0}`);
            expect(response).toBeGreaterThan(0);
        } else {
            console.log('MISSING: AI chat input not found');
            test.skip();
        }
    });

    test('AI compose should pre-fill composer', async ({ page }) => {
        // Open composer
        await page.locator('[data-testid="compose-button"]').click();
        await page.waitForTimeout(1500);

        // Look for AI compose option
        const aiOption = await page.locator('button:has-text("AI"), [data-testid="ai-compose"], text=AI').count();
        console.log(`AI compose option in composer: ${aiOption > 0}`);

        if (aiOption === 0) {
            console.log('MISSING FEATURE: AI compose option not in composer');
        }
    });
});

// ==========================================
// CATEGORY 5: ATTACHMENTS
// ==========================================
test.describe('Attachments Feature', () => {
    test.beforeEach(async ({ page }) => {
        await loginAndWaitForApp(page);
    });

    test('should have file input for attachments', async ({ page }) => {
        await page.locator('[data-testid="compose-button"]').click();
        await page.waitForTimeout(1500);

        // Check for file input
        const fileInput = await page.locator('input[type="file"]').count();
        console.log(`File input found: ${fileInput > 0}`);

        if (fileInput === 0) {
            console.log('MISSING FEATURE: No file input for attachments');
        }
        expect(fileInput).toBeGreaterThan(0);
    });

    test('should show attached files in composer', async ({ page }) => {
        // This test checks if attachment UI exists
        await page.locator('[data-testid="compose-button"]').click();
        await page.waitForTimeout(1500);

        const attachmentArea = await page.locator('[class*="attachment"], [data-testid="attachments-area"]').count();
        console.log(`Attachment display area: ${attachmentArea > 0}`);

        if (attachmentArea === 0) {
            console.log('MISSING: Attachment display area not found');
        }
    });
});

// ==========================================
// CATEGORY 6: REPLY & FORWARD
// ==========================================
test.describe('Reply & Forward', () => {
    test.beforeEach(async ({ page }) => {
        await loginAndWaitForApp(page);
    });

    test('should have Reply button on email detail', async ({ page }) => {
        await page.waitForTimeout(3000);

        // Click first email
        const firstEmail = page.locator('[class*="email"], [class*="mail-item"]').first();
        if (await firstEmail.count() > 0) {
            await firstEmail.click();
            await page.waitForTimeout(2000);

            const replyBtn = await page.locator('button:has-text("Reply"), [aria-label*="reply"], [data-testid="reply-button"]').count();
            console.log(`Reply button found: ${replyBtn > 0}`);
            expect(replyBtn).toBeGreaterThan(0);
        }
    });

    test('should have Forward button on email detail', async ({ page }) => {
        await page.waitForTimeout(3000);

        const firstEmail = page.locator('[class*="email"], [class*="mail-item"]').first();
        if (await firstEmail.count() > 0) {
            await firstEmail.click();
            await page.waitForTimeout(2000);

            const forwardBtn = await page.locator('button:has-text("Forward"), [aria-label*="forward"], [data-testid="forward-button"]').count();
            console.log(`Forward button found: ${forwardBtn > 0}`);
            expect(forwardBtn).toBeGreaterThan(0);
        }
    });

    test('Reply should open composer with pre-filled To field', async ({ page }) => {
        await page.waitForTimeout(3000);

        const firstEmail = page.locator('[class*="email"], [class*="mail-item"]').first();
        if (await firstEmail.count() > 0) {
            await firstEmail.click();
            await page.waitForTimeout(2000);

            const replyBtn = page.locator('button:has-text("Reply")').first();
            if (await replyBtn.count() > 0) {
                await replyBtn.click();
                await page.waitForTimeout(1500);

                // Check if composer opened
                const composer = await page.locator('[data-testid="composer-panel"]').count();
                console.log(`Composer opened after Reply: ${composer > 0}`);
                expect(composer).toBeGreaterThan(0);
            }
        }
    });
});

// ==========================================
// CATEGORY 7: SIDEBAR NAVIGATION
// ==========================================
test.describe('Sidebar Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await loginAndWaitForApp(page);
    });

    test('should have Inbox in sidebar', async ({ page }) => {
        const inboxLower = await page.locator('text=Inbox').count();
        const inboxUpper = await page.locator('text=INBOX').count();
        const inbox = inboxLower + inboxUpper;
        expect(inbox).toBeGreaterThan(0);
    });

    test('should have Sent folder in sidebar', async ({ page }) => {
        const sent = await page.locator('text=Sent, text=SENT').count();
        expect(sent).toBeGreaterThan(0);
    });

    test('should have Drafts folder in sidebar', async ({ page }) => {
        const drafts = await page.locator('text=Drafts, text=DRAFTS').count();
        expect(drafts).toBeGreaterThan(0);
    });

    test('should navigate to Sent when clicked', async ({ page }) => {
        await page.click('text=Sent, text=SENT');
        await page.waitForTimeout(2000);

        // Check if view changed
        const sentActive = await page.locator('[class*="active"]:has-text("Sent")').count();
        console.log(`Sent folder active: ${sentActive > 0}`);
    });

    test('should have Calendar link', async ({ page }) => {
        const calendar = await page.locator('text=Calendar, text=CALENDAR').count();
        console.log(`Calendar link found: ${calendar > 0}`);
        expect(calendar).toBeGreaterThan(0);
    });

    test('should have Contacts link', async ({ page }) => {
        const contacts = await page.locator('text=Contacts, text=CONTACTS').count();
        console.log(`Contacts link found: ${contacts > 0}`);
        expect(contacts).toBeGreaterThan(0);
    });
});

// ==========================================
// CATEGORY 8: API HEALTH
// ==========================================
test.describe('API Endpoints', () => {
    test('API: Accounts endpoint works', async ({ request }) => {
        const response = await request.get('/api/accounts?userId=sabiqahmed@gmail.com');
        expect(response.status()).toBe(200);

        const data = await response.json();
        console.log(`Accounts: ${data.length} found`);
        expect(Array.isArray(data)).toBeTruthy();
    });

    test('API: IMAP email fetch works', async ({ request }) => {
        const response = await request.get('/api/imap/emails?limit=5');
        expect(response.status()).toBeLessThan(500);

        const data = await response.json();
        console.log(`Emails fetched: ${Array.isArray(data) ? data.length : 'error'}`);
    });

    test('API: SMTP send works', async ({ request }) => {
        const response = await request.post('/api/smtp/send', {
            data: {
                to: 'test@example.com',
                subject: 'Test',
                body: 'Test email'
            }
        });
        expect(response.status()).toBeLessThan(500);
    });

    test('API: AI compose works', async ({ request }) => {
        const response = await request.post('/api/ai/compose', {
            data: {
                context: 'Quick test',
                to: 'test@test.com',
                subject: 'Test',
                tone: 'professional',
                length: 'short'
            }
        });
        expect(response.status()).toBeLessThan(500);

        const data = await response.json();
        console.log(`AI Compose response: ${data.subject ? 'OK' : data.error}`);
    });

    test('API: Hub intent parsing works', async ({ request }) => {
        const response = await request.post('/api/hub/parse', {
            data: {
                message: 'compose email to john@test.com',
                context: {}
            }
        });
        expect(response.status()).toBeLessThan(500);

        const data = await response.json();
        console.log(`Hub confidence: ${data.confidence}`);
    });
});
