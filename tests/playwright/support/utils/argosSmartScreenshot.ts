import { Locator, Page } from 'playwright';
import { argosScreenshot } from '@argos-ci/playwright';
import { argosCustomStyles } from './argosStyles';

const STYLE_TAG_ID = 'argos-stabilizers';

async function injectStabilizers(page: Page) {
  await page.evaluate(
    ({ id, css }) => {
      if (document.getElementById(id)) return;
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = css;
      document.head.appendChild(tag);
    },
    { id: STYLE_TAG_ID, css: argosCustomStyles },
  );
  await page.evaluate(() => document.fonts.ready);
}

export async function argosFullScreenshot(params: {
  page: Page;
  snapshotName: string;
}) {
  const { page, snapshotName } = params;
  await injectStabilizers(page);
  await argosScreenshot(page, snapshotName, { fullPage: true });
}

export async function argosComponentScreenshot(params: {
  page: Page;
  snapshotName: string;
  selector: Locator;
}) {
  const { page, snapshotName, selector } = params;
  await injectStabilizers(page);
  await selector.scrollIntoViewIfNeeded();
  await argosScreenshot(page, snapshotName, { element: selector });
}
