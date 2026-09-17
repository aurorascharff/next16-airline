import { defineConfig, devices } from '@playwright/test';

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseURL ?? 'http://localhost:3100';

// Tests start signed in as the seeded "Vex" traveler; login.spec.ts opts out.
export const signedInState = {
  cookies: [
    {
      domain: 'localhost',
      expires: -1,
      httpOnly: true,
      name: 'waypoint-user',
      path: '/',
      sameSite: 'Lax' as const,
      secure: false,
      value: 'vex',
    },
  ],
  origins: [],
};

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './tests',
  use: {
    baseURL,
    storageState: signedInState,
    trace: 'on-first-retry',
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'pnpm dev --port 3100',
        reuseExistingServer: false,
        stdout: 'pipe',
        url: baseURL,
      },
  workers: 1,
});
