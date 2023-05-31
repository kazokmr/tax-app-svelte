import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { CalcTaxParam, CalcTaxResult } from "$lib/fetch/client/calcTax";
import { calcTax } from "$lib/fetch/client/calcTax";
import { setupServer } from "msw/node";
import { rest } from "msw";

// MSWのNodeサーバーのセットアップとクローズ処理
const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("所得税計算APIをコールする", () => {
  test("所得税計算APIを呼び出せる", async () => {

    // Begin
    // mswのHandlerを設定する
    server.use(
      rest.post("http://localhost:3000/calc-tax", async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ tax: 15_315 }));
      })
    );

    // When
    const response = await calcTax({
      yearsOfService: 6,
      isOfficer: false,
      isDisability: false,
      severancePay: 3_000_000
    } satisfies CalcTaxParam);

    // Then
    expect(response.status).toBe(200);
    expect((await response.json()) satisfies CalcTaxResult).toStrictEqual({ tax: 15_315 });
  });
});