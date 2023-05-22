import { describe, expect, test } from "vitest";
import request from "supertest";
import app from "./app";

describe("POST /calc-tax", () => {
  test("退職金の所得税を計算する", async () => {
    const res = await request(app).post("/calc-tax").send({
      yearsOfService: 6,
      isOfficer: false,
      isDisability: false,
      severancePay: 3_000_000
    });
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({ tax: 15_315 });
  });
});
