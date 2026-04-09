import {BasePage} from './BasePage';
import {Locator, Page} from '@playwright/test';

export class LoginPage extends BasePage{
    readonly userInput: Locator;
    readonly passInput: Locator;
    readonly loginButton: Locator;
    readonly signupLink: Locator;

    constructor(page: Page){
        super(page);

        this.userInput = page.locator('input[type="text"]');
        this.passInput = page.locator('input[type="password"]');
        this.loginButton = page.getByRole('button', {name: 'Login'});
        this.signupLink = page.getByRole('link', {name: 'Sign Up'});
    }

    async goto(){
        await this.navigateTo('/login');
    }

    async login(user: string, pass: string){
        await this.userInput.fill(user);
        await this.passInput.fill(pass);
        await this.loginButton.click();
    }
}