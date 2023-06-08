import { expect, Page } from "@playwright/test";
import { test } from "./utils/my-test";

export let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();

  page.goto("/");
});

test.afterAll(async () => {
  await page.close();
});

test("has title", async () => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Magic + Aptos + React");
});

test("Magic link", async () => {
  const popupPromise = page.waitForEvent("popup");

  // Click the get started link.
  await page.getByRole("link", { name: "Magic logo" }).click();
  const popup = await popupPromise;

  // Expects the URL to contain intro.
  await expect(popup).toHaveURL(/.*magic.link/);
});

test("Aptos link", async () => {
  const popupPromise = page.waitForEvent("popup");

  // Click the get started link.
  await page.getByRole("link", { name: "Aptos logo" }).click();
  const popup = await popupPromise;

  // Expects the URL to contain intro.
  await expect(popup).toHaveURL(/.*aptoslabs.com/);
});

test("Sign in with Magic Link", async ({ params: { email } }) => {
  const form = page.getByPlaceholder("Enter your email");
  // Please change the email address to your own.
  await form.fill(email);
  await form.press("Enter");

  await page
    .getByRole("button", { name: "Logout" })
    .waitFor({ state: "visible", timeout: 180000 });
});

test("Check if your wallet address is correct", async ({
  params: { walletAddress },
}) => {
  const box = page.getByTestId("account-info-box");

  await expect(box).toContainText(walletAddress);
});

test("Balance should not be 0", async () => {
  const box = page.getByTestId("balance-box");

  await expect(box).not.toHaveText("0", {
    timeout: 30000,
  });
});

test("Sign transansaction", async () => {
  await page.getByRole("button", { name: "signTransaction" }).click();

  const resultBox = page.getByTestId("transaction-result-box");

  await expect(resultBox).not.toHaveText("null", {
    timeout: 30000,
  });
});

test("Sign and Submit transaction", async () => {
  await page.getByRole("button", { name: "signAndSubmitTransaction" }).click();

  const resultBox = page.getByTestId("transaction-result-box");

  await expect(resultBox).not.toHaveText("null", {
    timeout: 30000,
  });
});

test("Sign and Submit BCS transaction", async () => {
  await page
    .getByRole("button", { name: "signAndSubmitBCSTransaction" })
    .click();

  const resultBox = page.getByTestId("bcs-transaction-result-box");

  await expect(resultBox).not.toHaveText("null", {
    timeout: 30000,
  });
});

test("Sign message", async () => {
  await page.getByRole("button", { name: "signMessage", exact: true }).click();

  const resultBox = page.getByTestId("message-result-box");

  await expect(resultBox).not.toHaveText("null", {
    timeout: 30000,
  });
});

test("Sign message and verify", async () => {
  await page
    .getByRole("button", { name: "signMessageAndVerify", exact: true })
    .click();

  const resultBox = page.getByTestId("message-result-box");

  await expect(resultBox).not.toHaveText("null", {
    timeout: 30000,
  });
});
