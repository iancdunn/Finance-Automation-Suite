import {test as base} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import {SignupPage} from '../pages/SignupPage';
import {HomePage} from '../pages/HomePage';
import fs from 'fs';
import path from 'path';

type Fixtures = {
    loginPage: LoginPage;
    signupPage: SignupPage;
    homePage: HomePage;
};

export const test = base.extend<Fixtures, {workerStorageState: string}>({
    storageState: ({workerStorageState}, use) => use(workerStorageState),

    workerStorageState: [async ({browser}, use)=>{
        const id = test.info().parallelIndex % 4 + 1;
        const fName = path.resolve(test.info().project.outputDir, `.auth/demo${id}.json`);

        if(fs.existsSync(fName)){
            await use(fName);
            return;
        }

        const project = test.info().project;
        const baseURL = project.use.baseURL;
        const page = await browser.newPage({storageState: undefined, baseURL: baseURL});
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(`demo${id}`, 'password123');

        await page.waitForURL('/');

        await page.context().storageState({path: fName});
        await page.close();
        await use(fName);
    }, {scope: 'worker'}],

    loginPage: async({page}, use)=>{
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    signupPage: async({page}, use)=>{
        const signupPage = new SignupPage(page);
        await use(signupPage);
    },
    homePage: async({page}, use)=>{
        const homePage = new HomePage(page);
        await use(homePage);
    }
});

export {expect} from '@playwright/test';