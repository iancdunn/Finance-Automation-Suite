import {BasePage} from './BasePage';
import {Locator, Page} from '@playwright/test';

export class SignupPage extends BasePage{
    readonly userInput: Locator;
    readonly passInput: Locator;
    readonly signupButton: Locator;
    readonly loginLink: Locator;

    constructor(page: Page){
        super(page);

        this.userInput = page.locator('input[type="text"]');
        this.passInput = page.locator('input[type="password"]');
        this.signupButton = page.getByRole('button', {name: 'Sign Up'});
        this.loginLink = page.getByRole('link', {name: 'Login'});
    }

    async goto(){
        await this.navigateTo('/signup');
    }

    async signup(user: string, pass: string){
        await this.userInput.fill(user);
        await this.passInput.fill(pass);
        await this.signupButton.click();
    }
}