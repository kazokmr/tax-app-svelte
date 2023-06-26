import { expect, test } from "@playwright/test";
import type { IWireMockRequest, IWireMockResponse } from "wiremock-captain";
import { WireMock } from "wiremock-captain";

test.describe("ページコンポーネントのAction操作", () => {
  test("所得税を計算できる", async ({ page }) => {
    // Begin
    const wiremockEndpoint = "http://localhost:3000";
    const mock = new WireMock(wiremockEndpoint);

    const request: IWireMockRequest = {
      method: "POST",
      endpoint: "/calc-tax",
      body: {
        yearsOfService: 10,
        isDisability: false,
        isOfficer: false,
        severancePay: 5000000
      }
    };

    const mockedResponse: IWireMockResponse = {
      status: 200,
      body: {
        tax: 25525
      }
    };
    await mock.register(request, mockedResponse);

    await page.goto("http://localhost:4173/");

    // When
    await page.getByRole("spinbutton", { name: "勤続年数" }).click();
    await page.getByRole("spinbutton", { name: "勤続年数" }).fill("10");
    await page.getByRole("spinbutton", { name: "退職金" }).click();
    await page.getByRole("spinbutton", { name: "退職金" }).fill("5000000");

    await page.getByRole("button", { name: "所得税を計算する" }).click();

    // Then
    await expect(page.getByLabel("tax")).toHaveText("25,525 円");
  });
});

test.skip("index page has expected h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Welcome to SvelteKit" })).toBeVisible();
});
