import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';
import { BaseFormComponent } from '../forms/BaseFormComponent';

export type SmartTableColumn = 'id' | 'firstName' | 'lastName' | 'username' | 'email' | 'age';

const COLUMNS: SmartTableColumn[] = ['id', 'firstName', 'lastName', 'username', 'email', 'age'];

export type SmartTableRowValues = Partial<Record<SmartTableColumn, string>>;

export class SmartTablePageComponent extends BaseFormComponent {
  readonly table: Locator;
  readonly rows: Locator;
  readonly filterInputs: Locator;
  readonly addRowBtn: Locator;
  readonly addFormRow: Locator;
  readonly addConfirmBtn: Locator;
  readonly addCancelBtn: Locator;
  readonly editSaveBtn: Locator;
  readonly editCancelBtn: Locator;

  constructor(page: Page) {
    super(page, 'smart-table-card');
    this.table = this.card.getByTestId('smart-table');
    this.rows = this.table.locator('tr.ng2-smart-row');
    this.filterInputs = this.table.locator('tr.ng2-smart-filters .ng2-smart-filter input');
    this.addRowBtn = this.table.locator('a.ng2-smart-action-add-add');
    this.addFormRow = this.table.locator('tr[ng2-st-thead-form-row]');
    this.addConfirmBtn = this.table.locator('a.ng2-smart-action-add-create');
    this.addCancelBtn = this.table.locator('a.ng2-smart-action-add-cancel');
    this.editSaveBtn = this.table.locator('a.ng2-smart-action-edit-save');
    this.editCancelBtn = this.table.locator('a.ng2-smart-action-edit-cancel');
  }

  private columnIndex(column: SmartTableColumn): number {
    return COLUMNS.indexOf(column);
  }

  filterInputFor(column: SmartTableColumn): Locator {
    return this.filterInputs.nth(this.columnIndex(column));
  }

  row(index: number): Locator {
    return this.rows.nth(index);
  }

  cellText(rowIndex: number, column: SmartTableColumn): Promise<string> {
    return this.row(rowIndex).locator('td').nth(this.columnIndex(column) + 1).innerText();
  }

  async filterBy(column: SmartTableColumn, text: string) {
    await this.filterInputFor(column).fill(text);
  }

  async clearFilter(column: SmartTableColumn) {
    await this.filterInputFor(column).fill('');
  }

  async assertRowCount(count: number) {
    await expect(this.rows).toHaveCount(count);
  }

  async startAddRow() {
    await this.addRowBtn.click();
  }

  async fillAddInputs(values: SmartTableRowValues) {
    for (const column of COLUMNS) {
      const value = values[column];
      if (value !== undefined) {
        await this.addFormRow.locator('input').nth(this.columnIndex(column)).fill(value);
      }
    }
  }

  async fillEditInputs(rowIndex: number, values: SmartTableRowValues) {
    const editingRow = this.row(rowIndex);
    for (const column of COLUMNS) {
      const value = values[column];
      if (value !== undefined) {
        await editingRow.locator('input').nth(this.columnIndex(column)).fill(value);
      }
    }
  }

  async confirmAdd() {
    await this.addConfirmBtn.first().click();
  }

  async cancelAdd() {
    await this.addCancelBtn.first().click();
  }

  async startEditRow(index: number) {
    await this.row(index).locator('a.ng2-smart-action-edit-edit').click();
  }

  async confirmEdit() {
    await this.editSaveBtn.first().click();
  }

  async cancelEdit() {
    await this.editCancelBtn.first().click();
  }

  async deleteRow(index: number, accept = true) {
    this.page.once('dialog', (dialog) => {
      if (accept) dialog.accept();
      else dialog.dismiss();
    });
    await this.row(index).locator('a.ng2-smart-action-delete-delete').click();
  }
}
