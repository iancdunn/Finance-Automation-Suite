import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './Automation_Suite/tests',
  fullyParallel: true,
  reporter: 'html',

  use:{
    baseURL: process.env.BASE_URL || 'http://localhost:5153',
    trace: 'on-first-retry',
  },
  workers: 4,
  projects:[
    {
      name: 'auth-tests',
      testMatch: /.*auth\.test\.ts/,
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'chromium', 
      use: {...devices['Desktop Chrome']},
      testIgnore: /.*auth\.test\.ts/,
    },
  ],

  webServer: process.env.BASEURL ? undefined : {
    command: 'dotnet run',
    cwd: './Visionsofme',
    url: 'http://localhost:5153',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});