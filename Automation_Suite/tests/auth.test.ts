import {expect, test} from '../fixtures/pom-fixtures';

test('User can successfully login', async({page, loginPage})=>{
    await loginPage.goto();
    await loginPage.login('demo1', 'password123');
    
    await expect(page).toHaveURL('/');
});

test('User cannot login with an incorrect password', async({page, loginPage})=>{
    await loginPage.goto();
    await loginPage.login('demo1', 'Password123');

    await expect(page.getByText('Invalid username or password.')).toBeVisible();
    await expect(page).toHaveURL('login');
});

test('User cannot sign up with an existing username', async({page, signupPage})=>{
    await signupPage.goto();
    await signupPage.signup('demo1', 'password123');

    await expect(page.getByText('Username already exists.')).toBeVisible();
    await expect(page).toHaveURL('signup');
});