import {expect, test} from '../fixtures/pom-fixtures';

test.beforeEach(async({page, homePage})=>{
    //Resets balances to 0, allocation to 50/30/20, and deletes all transactions
    await page.request.post('reset_data');
    await homePage.goto();
});

test('Users can add deposits', async({homePage})=>{
    await homePage.addTransaction('Deposit', 'Needs', '.01');
    
    await expect(homePage.needsBal).toHaveText('$0.01');
    await expect(homePage.savingsBal).toHaveText('$0.00');
    await expect(homePage.wantsBal).toHaveText('$0.00');
    await expect(homePage.recentTx.first()).toContainText('$0.01');
});

test('Users can deposit large amounts', async({homePage})=>{
    await homePage.addTransaction('Deposit', 'Needs', '999999999.99');

    await expect(homePage.needsBal).toHaveText('$500,000,000.00');
    await expect(homePage.savingsBal).toHaveText('$300,000,000.00');
    await expect(homePage.wantsBal).toHaveText('$199,999,999.99');
    await expect(homePage.recentTx.first()).toContainText('$999,999,999.99');
});

test('Users cannot deposit non-positive amounts', async({page, homePage})=>{
    await homePage.addTransaction('Deposit', 'Needs', '0');

    await expect(page.getByText('Transaction amounts must be positive.')).toBeVisible();
});

test('Users can add withdrawals', async({homePage})=>{
    await homePage.addTransaction('Withdrawal', 'Needs', '.01');

    await expect(homePage.needsBal).toHaveText('$-0.01');
    await expect(homePage.savingsBal).toHaveText('$0.00');
    await expect(homePage.wantsBal).toHaveText('$0.00');
    await expect(homePage.recentTx.first()).toContainText('$0.01');
});

test('Users can withdraw large amounts', async({homePage})=>{
    await homePage.addTransaction('Withdrawal', 'Wants', '999999999.99');

    await expect(homePage.needsBal).toHaveText('$0.00');
    await expect(homePage.savingsBal).toHaveText('$0.00');
    await expect(homePage.wantsBal).toHaveText('$-999,999,999.99');
    await expect(homePage.recentTx.first()).toContainText('$999,999,999.99');
});

test('Users cannot withdraw non-positive amounts', async({page, homePage})=>{
    await homePage.addTransaction('Withdrawal', 'Needs', '0');

    await expect(page.getByText('Transaction amounts must be positive.')).toBeVisible();
});