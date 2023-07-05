import app from "./app";
import request from "supertest";
import { describe, expect, test } from "vitest";

describe("POST /calc-tax", () => {
  test("退職金の所得税を計算する", async () => {
    const res = await request(app).post("/calc-tax").send({
      yearsOfService: 6,
      isOfficer: false,
      isDisability: false,
      severancePay: 3_000_000,
    });
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({ tax: 15_315 });
  });
  describe("入力値バリデーション", () => {
    describe("勤続年数は1以上100以下の整数であること", () => {
      test.each`
        yearsOfService
        ${-1}
        ${0}
        ${101}
        ${10.5}
      `("勤続年数 $yearsOfService年はエラー", async ({ yearsOfService }) => {
        const res = await request(app).post("/calc-tax").send({
          yearsOfService,
          isOfficer: false,
          isDisability: false,
          severancePay: 3_000_000,
        });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
    });
    describe("退職金は0円以上1兆円以下の整数", () => {
      test.each`
        severancePay
        ${-1}
        ${1_000_000_000_001}
        ${8_000_000.1}
      `("$severancePay円はエラー", async ({ severancePay }) => {
        const res = await request(app).post("/calc-tax").send({
          yearsOfService: 6,
          isOfficer: false,
          isDisability: false,
          severancePay,
        });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
    });
    describe("不正な値の場合", () => {
      test.each`
        yearsOfService
        ${null}
        ${undefined}
        ${"some string"}
      `("勤続年数: $yearsOfServiceはエラー", async ({ yearsOfService }) => {
        const res = await request(app).post("/calc-tax").send({
          yearsOfService,
          isDisability: false,
          isOfficer: false,
          severancePay: 3_000_000,
        });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
      test.each`
        isDisability
        ${null}
        ${undefined}
        ${"some string"}
      `(
        "障害者となったことに直接起因して退職したか: $isDisabilityはエラー",
        async ({ isDisability }) => {
          const res = await request(app).post("/calc-tax").send({
            yearsOfService: 6,
            isDisability,
            isOfficer: false,
            severancePay: 3_000_000,
          });
          expect(res.status).toBe(400);
          expect(res.body).toStrictEqual({ message: "Invalid parameter." });
        },
      );
      test.each`
        isOfficer
        ${null}
        ${undefined}
        ${"some string"}
      `("役員等かどうか: $isOfficerはエラー", async ({ isOfficer }) => {
        const res = await request(app).post("/calc-tax").send({
          yearsOfService: 6,
          isDisability: false,
          isOfficer,
          severancePay: 3_000_000,
        });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
      test.each`
        severancePay
        ${null}
        ${undefined}
        ${"some string"}
      `("退職金: $severancePayはエラー", async ({ severancePay }) => {
        const res = await request(app).post("/calc-tax").send({
          yearsOfService: 6,
          isOfficer: false,
          isDisability: false,
          severancePay,
        });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
    });
    describe("プロパティが未定義の場合", async () => {
      test("勤続年数が未定義の場合はエラー", async () => {
        const res = await request(app).post("/calc-tax").send({
          isDisability: false,
          isOfficer: false,
          severancePay: 3_000_000,
        });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
      test("障害者となったことに直接起因して退職しかが未定義の場合はエラー", async () => {
        const res = await request(app).post("/calc-tax").send({
          yearsOfService: 6,
          isOfficer: false,
          severancePay: 3_000_000,
        });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
      test("役員等かが未定義の場合はエラー", async () => {
        const res = await request(app).post("/calc-tax").send({
          yearsOfService: 6,
          isDisability: false,
          severancePay: 3_000_000,
        });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
      test("退職金が未定義の場合はエラー", async () => {
        const res = await request(app).post("/calc-tax").send({
          yearsOfService: 6,
          isDisability: false,
          isOfficer: false,
        });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
    });
    describe("不正なオブジェクトの場合", () => {
      test("意図していないプロパティが含まれる場合はエラー", async () => {
        const res = await request(app).post("/calc-tax").send({
          yearsOfService: 6,
          isDisability: false,
          isOfficer: false,
          severancePay: 3_000_000,
          invalidProperty: "",
        });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
      test("空オブジェクトの場合はエラー", async () => {
        const res = await request(app).post("/calc-tax").send({});
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
      test("オブジェクトではない場合はエラー", async () => {
        const res = await request(app).post("/calc-tax").send("not object");
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
      test("undefinedの場合はエラー", async () => {
        const res = await request(app).post("/calc-tax").send({ undefined });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
      test("nullの場合はエラー", async () => {
        const res = await request(app).post("/calc-tax").send({ null: null });
        expect(res.status).toBe(400);
        expect(res.body).toStrictEqual({ message: "Invalid parameter." });
      });
    });
  });
});
