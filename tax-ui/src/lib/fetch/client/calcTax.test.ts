import { rest } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { calcTax } from "$lib/fetch/client/calcTax";

// MSWのNodeサーバーのセットアップとクローズ処理
const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const rootPath = "http://localhost:3000";

describe("所得税計算APIをコールする", () => {
  test("所得税計算APIを呼び出せる", async () => {
    // Begin
    // mswのHandlerを設定する
    server.use(
      rest.post(`${rootPath}/calc-tax`, async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ tax: 15_315 }));
      })
    );

    // When
    const response = await calcTax({
      yearsOfService: 6,
      isDisability: false,
      isOfficer: "0",
      severancePay: 3_000_000
    });

    // Then
    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual({ tax: 15_315 });
  });

  test("所得税計算APIがBad Requestを返す場合", async () => {
    // Begin
    server.use(
      rest.post(`${rootPath}/calc-tax`, (req, res, context) =>
        res(context.status(400), context.json({ message: "Invalid parameter." }))
      )
    );

    // When
    const response = await calcTax({
      yearsOfService: 6,
      isDisability: false,
      isOfficer: "0",
      severancePay: 3_000_000
    });

    // Then
    expect(response.ok).toBe(false); // Response.ok は status 2xx のみTrue
    expect(response.status).toBe(400);
    expect(await response.json()).toStrictEqual({ message: "Invalid parameter." });
  });
});
