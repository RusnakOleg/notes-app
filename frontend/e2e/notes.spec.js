import { expect, test } from '@playwright/test';

test('user can create, edit and delete a note', async ({ page }) => {
  const title = `E2E note ${Date.now()}`;
  const editedTitle = `${title} (edited)`;
  const card = (text) => page.getByRole('listitem').filter({ hasText: text });
  const dialog = page.getByRole('dialog');

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Notes' })).toBeVisible();

  // Create
  await page.getByRole('button', { name: 'New note' }).click();
  await dialog.getByLabel('Title').fill(title);
  await dialog.getByLabel('Content').fill('Created by Playwright');
  await dialog.getByRole('button', { name: 'Save' }).click();
  await expect(card(title)).toBeVisible();
  await expect(card(title)).toContainText('Created by Playwright');

  // Edit
  await card(title).getByRole('button', { name: 'Edit' }).click();
  await dialog.getByLabel('Title').fill(editedTitle);
  await dialog.getByRole('button', { name: 'Save' }).click();
  await expect(card(editedTitle)).toBeVisible();

  // Delete
  await card(editedTitle).getByRole('button', { name: 'Delete' }).click();
  await expect(dialog).toContainText(editedTitle);
  await dialog.getByRole('button', { name: 'Delete' }).click();
  await expect(card(editedTitle)).toHaveCount(0);
});

test('user can switch the interface language', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'UA', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Нотатки' })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Нотатки' })).toBeVisible();

  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Notes' })).toBeVisible();
});