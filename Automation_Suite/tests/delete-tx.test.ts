import {expect, test} from '../fixtures/pom-fixtures';

test.beforeEach(async({page, homePage})=>{
    //Resets balances to 0, allocation to 50/30/20, and deletes all transactions
    await page.request.post('reset_data');
    await homePage.goto();
});

test('Users can delete deposits', async({homePage})=>{
    await homePage.addTransaction('Deposit', 'Needs', '1');
    await homePage.deleteTransaction();

    await expect(homePage.needsBal).toHaveText('$0.00');
    await expect(homePage.savingsBal).toHaveText('$0.00');
    await expect(homePage.wantsBal).toHaveText('$0.00');
    await expect(homePage.recentTx.first()).toHaveText('No transactions yet.');
});

test('Users can delete withdrawals', async({homePage})=>{
    await homePage.addTransaction('Withdrawal', 'Needs', '1');
    await homePage.deleteTransaction();

    await expect(homePage.needsBal).toHaveText('$0.00');
    await expect(homePage.savingsBal).toHaveText('$0.00');
    await expect(homePage.wantsBal).toHaveText('$0.00');
    await expect(homePage.recentTx.first()).toHaveText('No transactions yet.');
});