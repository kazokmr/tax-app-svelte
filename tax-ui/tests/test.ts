import { expect, test } from "@playwright/test";
import { DockerComposeEnvironment, StartedDockerComposeEnvironment } from "testcontainers";
import type { IWireMockRequest, IWireMockResponse } from "wiremock-captain";
import { WireMock } from "wiremock-captain";

test.describe("ページコンポーネントのAction操作", () => {
  let environment: StartedDockerComposeEnvironment;
  let mock: WireMock;
  test.beforeAll(async () => {
    environment = await new DockerComposeEnvironment("./tests", "compose.yml").up();
    const wiremockEndpoint = "http://localhost:3000";
    mock = new WireMock(wiremockEndpoint);
  });
  test.afterAll(async () => {
    await environment.down();
  });

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

  test("所得税を計算できる", async ({ page }) => {
    // Begin
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
  test("APIからのステータスコードが200-209以外の場合", async ({ page }) => {
    // Begin
    const mockedResponse: IWireMockResponse = {
      status: 400,
      body: {
        message: "Invalid parameter."
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
    await expect(
      page.getByText("エラーが発生しました。しばらくしてからもう一度お試しください。")
    ).toBeVisible();
  });
});
