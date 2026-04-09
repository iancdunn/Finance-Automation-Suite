import {expect, test} from '../fixtures/pom-fixtures';

test.beforeEach(async({page, homePage})=>{
    //Resets balances to 0, allocation to 50/30/20, and deletes all transactions
    await page.request.post('reset_data');
    await homePage.goto();
});

test('Users can update allocation to positive values', async({homePage})=>{
    await homePage.updateAllocation('.01', '.02', '99.97');

    await expect(homePage.needsPct).toHaveText('(0.01%)');
    await expect(homePage.savingsPct).toHaveText('(0.02%)');
    await expect(homePage.wantsPct).toHaveText('(99.97%)');
});

test('Users can update allocation values to 0 and 100', async({homePage})=>{
    await homePage.updateAllocation('0', '0', '100');

    await expect(homePage.needsPct).toHaveText('(0%)');
    await expect(homePage.savingsPct).toHaveText('(0%)');
    await expect(homePage.wantsPct).toHaveText('(100%)');
});

test('Users can leave allocations blank', async({homePage})=>{
    await homePage.updateAllocation('', '', '');

    await expect(homePage.needsPct).toHaveText('(50%)');
    await expect(homePage.savingsPct).toHaveText('(30%)');
    await expect(homePage.wantsPct).toHaveText('(20%)');
});

test('Users cannot update allocation to negative values', async({page, homePage})=>{
    await homePage.updateAllocation('-.01', '.01', '100');

    await expect(page.getByText('Percentages must be between 0% and 100%.')).toBeVisible();
});

test('Users cannot update allocation to values above 100', async({page, homePage})=>{
    await homePage.updateAllocation('0', '0', '100.01');

    await expect(page.getByText('Percentages must be between 0% and 100%.')).toBeVisible();
});

test('Users cannot update allocation to values that do not add up to 100', async({page, homePage})=>{
    await homePage.updateAllocation('.01', '.02', '99.98');

    await expect(page.getByText('Percentages must add up to 100%.')).toBeVisible();
});