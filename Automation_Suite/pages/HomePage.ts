import {BasePage} from './BasePage';
import {Locator, Page} from '@playwright/test';

export class HomePage extends BasePage{
    readonly needsBal: Locator;
    readonly savingsBal: Locator;
    readonly wantsBal: Locator;
    readonly needsPct: Locator;
    readonly savingsPct: Locator;
    readonly wantsPct: Locator;
    
    readonly needsBalInput: Locator;
    readonly savingsBalInput: Locator;
    readonly wantsBalInput: Locator;
    readonly needsPctInput: Locator;
    readonly savingsPctInput: Locator;
    readonly wantsPctInput: Locator;
    readonly settingsButton: Locator;

    readonly typeInput: Locator;
    readonly categoryInput: Locator;
    readonly txAmtInput: Locator;
    readonly txButton: Locator;

    readonly recentTx: Locator;
    readonly deleteTx: Locator;

    constructor(page: Page){
        super(page);

        this.needsBal = page.locator('#needs-bal');
        this.savingsBal = page.locator('#savings-bal');
        this.wantsBal = page.locator('#wants-bal');
        this.needsPct = page.locator('#needs-pct');
        this.savingsPct = page.locator('#savings-pct');
        this.wantsPct = page.locator('#wants-pct');

        this.needsBalInput = page.getByLabel('Needs Bal');
        this.savingsBalInput = page.getByLabel('Savings Bal');
        this.wantsBalInput = page.getByLabel('Wants Bal');
        this.needsPctInput = page.getByLabel('Needs Pct');
        this.savingsPctInput = page.getByLabel('Savings Pct');
        this.wantsPctInput = page.getByLabel('Wants Pct');
        this.settingsButton = page.getByRole('button', {name: 'Update Settings'});

        this.typeInput = page.getByLabel('type');
        this.categoryInput = page.getByLabel('category');
        this.txAmtInput = page.getByLabel('amount');
        this.txButton = page.getByRole('button', {name: 'Add'});

        this.recentTx = page.getByRole('listitem');
        this.deleteTx = page.getByRole('link', {name: 'Delete'});
    }

    async goto(){
        await this.navigateTo('/');
    }

    async updateBalances(needsBal: string, savingsBal: string, wantsBal: string){
        await this.needsBalInput.fill(needsBal);
        await this.savingsBalInput.fill(savingsBal);
        await this.wantsBalInput.fill(wantsBal);
        await this.settingsButton.click();
    }

    async updateAllocation(needsPct: string, savingsPct: string, wantsPct: string){
        await this.needsPctInput.fill(needsPct);
        await this.savingsPctInput.fill(savingsPct);
        await this.wantsPctInput.fill(wantsPct);
        await this.settingsButton.click();
    }

    async addTransaction(type: string, category: string, amt: string){
        await this.typeInput.selectOption(type);
        await this.categoryInput.selectOption(category);
        await this.txAmtInput.fill(amt);
        await this.txButton.click();
    }

    async deleteTransaction(){
        await this.deleteTx.first().click();
    }
}