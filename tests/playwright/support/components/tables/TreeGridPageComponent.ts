import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';
import { BaseFormComponent } from '../forms/BaseFormComponent';

export type TreeGridColumn = 'name' | 'size' | 'kind' | 'items';

const COLUMNS: TreeGridColumn[] = ['name', 'size', 'kind', 'items'];

export class TreeGridPageComponent extends BaseFormComponent {
  readonly table: Locator;
  readonly searchInput: Locator;
  readonly rows: Locator;
  readonly headerCells: Locator;

  constructor(page: Page) {
    super(page, 'tree-grid-card');
    this.searchInput = this.card.getByTestId('tree-grid-search-input');
    this.table = this.card.getByTestId('tree-grid-table');
    this.rows = this.table.locator('tr[nbTreeGridRow]');
    this.headerCells = this.table.locator('th[nbTreeGridHeaderCell]');
  }

  row(index: number): Locator {
    return this.rows.nth(index);
  }

  rowByName(name: string): Locator {
    return this.rows.filter({ hasText: name });
  }

  async assertRowCount(count: number) {
    await expect(this.rows).toHaveCount(count);
  }

  async assertRowVisible(name: string) {
    await expect(this.rowByName(name).first()).toBeVisible();
  }

  async search(text: string) {
    await this.searchInput.fill(text);
  }

  async expandRow(name: string) {
    const toggle = this.rowByName(name).first().locator('nb-tree-grid-row-toggle');
    await toggle.click();
  }

  async sortByColumn(column: TreeGridColumn) {
    const idx = COLUMNS.indexOf(column);
    await this.headerCells.nth(idx).click();
  }

  cellText(rowIndex: number, column: TreeGridColumn): Promise<string> {
    const idx = COLUMNS.indexOf(column);
    return this.row(rowIndex).locator('td').nth(idx).innerText();
  }
}
