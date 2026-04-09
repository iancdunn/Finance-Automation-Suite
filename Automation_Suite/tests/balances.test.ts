import {expect, test} from '../fixtures/pom-fixtures';

test.beforeEach(async({page, homePage})=>{
    //Resets balances to 0, allocation to 50/30/20, and deletes all transactions
    await page.request.post('reset_data');
    await homePage.goto();
});

test('Users can update balances to positive values', async({homePage})=>{
    await homePage.updateBalances('.01', '.02', '.03');

    await expect(homePage.needsBal).toHaveText('$0.01');
    await expect(homePage.savingsBal).toHaveText('$0.02');
    await expect(homePage.wantsBal).toHaveText('$0.03');
});

test('Users can update balances to zero', async({homePage})=>{
    await homePage.updateBalances('0', '0', '0');

    await expect(homePage.needsBal).toHaveText('$0.00');
    await expect(homePage.savingsBal).toHaveText('$0.00');
    await expect(homePage.wantsBal).toHaveText('$0.00');
});

test('Users can leave balances blank', async({homePage})=>{
    await homePage.updateBalances('', '', '');

    await expect(homePage.needsBal).toHaveText('$0.00');
    await expect(homePage.savingsBal).toHaveText('$0.00');
    await expect(homePage.wantsBal).toHaveText('$0.00');
});

test('Users cannot update balances to negative values', async({page, homePage})=>{
    await homePage.updateBalances('-.01', '-.02', '-.03');

    await expect(page.getByText('Balances must not be negative.')).toBeVisible();
});