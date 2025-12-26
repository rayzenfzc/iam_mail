import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: false, // Run tests sequentially for email client
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Single worker for sequential testing
    reporter: 'html',

    use: {
        baseURL: 'http://localhost:5001',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1440, height: 900 }, // Ensure desktop view for Compose button
            },
        },
    ],

    // Run local server before tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5001',
        reuseExistingServer: true, // Use existing if running
        timeout: 30000,
    },
});
