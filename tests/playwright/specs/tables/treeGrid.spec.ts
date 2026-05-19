import { test, expect } from '../../fixtures/base_fixture';

test.describe('Tables - Tree Grid page', () => {
  test('renders the 3 root rows collapsed by default', async ({
    onApplicationURLs,
    onTreeGridPage,
  }) => {
    await test.step('Navigate to the tree-grid page', async () => {
      await onApplicationURLs.navigateToTreeGridPage();
    });

    await test.step('Assert 3 root rows visible (Projects, Reports, Other)', async () => {
      await onTreeGridPage.assertRowCount(3);
      await onTreeGridPage.assertRowVisible('Projects');
      await onTreeGridPage.assertRowVisible('Reports');
      await onTreeGridPage.assertRowVisible('Other');
    });
  });

  test('expanding "Projects" reveals its child rows', async ({
    onApplicationURLs,
    onTreeGridPage,
  }) => {
    await test.step('Navigate to the tree-grid page', async () => {
      await onApplicationURLs.navigateToTreeGridPage();
    });

    await test.step('Expand Projects row', async () => {
      await onTreeGridPage.expandRow('Projects');
    });

    await test.step('Assert child rows are visible', async () => {
      await onTreeGridPage.assertRowVisible('project-1.doc');
      await onTreeGridPage.assertRowVisible('project-2.doc');
      await onTreeGridPage.assertRowVisible('project-3');
      await onTreeGridPage.assertRowVisible('project-4.docx');
      await onTreeGridPage.assertRowCount(7); // 3 roots + 4 children
    });
  });

  test('searching by "Reports" filters down to the matching row', async ({
    onApplicationURLs,
    onTreeGridPage,
  }) => {
    await test.step('Navigate to the tree-grid page', async () => {
      await onApplicationURLs.navigateToTreeGridPage();
    });

    await test.step('Search for "Reports"', async () => {
      await onTreeGridPage.search('Reports');
    });

    await test.step('Assert Reports row visible and other roots no longer visible', async () => {
      await onTreeGridPage.assertRowVisible('Reports');
      await expect(onTreeGridPage.rowByName('Projects')).toHaveCount(0);
      await expect(onTreeGridPage.rowByName('Other')).toHaveCount(0);
    });
  });

  test('sorting by Name reorders the rows', async ({
    onApplicationURLs,
    onTreeGridPage,
  }) => {
    await test.step('Navigate to the tree-grid page', async () => {
      await onApplicationURLs.navigateToTreeGridPage();
    });

    const firstNameBefore = await onTreeGridPage.cellText(0, 'name');

    await test.step('Click name column header to sort', async () => {
      await onTreeGridPage.sortByColumn('name');
    });

    await test.step('Assert the first row name changed after sorting', async () => {
      const firstNameAfter = await onTreeGridPage.cellText(0, 'name');
      expect(firstNameAfter).not.toBe(firstNameBefore);
    });
  });
});
