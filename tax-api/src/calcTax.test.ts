import { describe, expect, test } from "vitest";
import { calcRetirementIncomeDeduction } from "./calcTax";

describe("退職所得控除額", () => {
  describe("勤続年数が20年以下", () => {
    describe("40万円 * 勤続年数", () => {
      describe("障害者になったことが直接の原因ではない場合", () => {
        test.each`
          yearsOfService | isDisability | expected
          ${2}           | ${false}     | ${800_000}
          ${3}           | ${false}     | ${1_200_000}
          ${19}          | ${false}     | ${7_600_000}
          ${20}          | ${false}     | ${8_000_000}
        `(
          "$yearsOfService年 isDisability:$isDisability-> $expected",
          ({ yearsOfService, isDisability, expected }) => {
            const deduction = calcRetirementIncomeDeduction({
              yearsOfService,
              isDisability
            });
            expect(deduction).toBe(expected);
          }
        );
      });
      describe("障害者になったことが直接の原因ではない場合は100万円を加える", () => {
        test.each`
          yearsOfService | isDisability | expected
          ${2}           | ${true}      | ${1_800_000}
          ${3}           | ${true}      | ${2_200_000}
          ${19}          | ${true}      | ${8_600_000}
          ${20}          | ${true}      | ${9_000_000}
        `(
          "$yearsOfService年 isDisability:$isDisability-> $expected",
          ({ yearsOfService, isDisability, expected }) => {
            const deduction = calcRetirementIncomeDeduction({
              yearsOfService,
              isDisability
            });
            expect(deduction).toBe(expected);
          }
        );
      });
    });
    describe("退職所得控除額の計算結果が80万円に満たない場合は80万円", () => {
      describe("障害者になったことが直接の原因ではない場合", () => {
        test.each`
          yearsOfService | isDisability | expected
          ${1}           | ${false}     | ${800_000}
        `(
          "$yearsOfService年 isDisability:$isDisability-> $expected",
          ({ yearsOfService, isDisability, expected }) => {
            const deduction = calcRetirementIncomeDeduction({
              yearsOfService,
              isDisability
            });
            expect(deduction).toBe(expected);
          }
        );
      });
      describe("障害者になったことが直接の原因ではない場合は100万円を加える", () => {
        test.each`
          yearsOfService | isDisability | expected
          ${1}           | ${true}      | ${1_800_000}
        `(
          "$yearsOfService年 isDisability:$isDisability-> $expected",
          ({ yearsOfService, isDisability, expected }) => {
            const deduction = calcRetirementIncomeDeduction({
              yearsOfService,
              isDisability
            });
            expect(deduction).toBe(expected);
          }
        );
      });
    });
  });
  describe("勤続年数が20年超", () => {
    describe("800万円 + 70万円 * (勤続年数 - 20年)", () => {
      describe("障害者になったことが直接の原因ではない場合", () => {
        test.each`
          yearsOfService | isDisability | expected
          ${21}          | ${false}     | ${8_700_000}
          ${30}          | ${false}     | ${15_000_000}
        `(
          "$yearsOfService年 isDisability:$isDisability-> $expected",
          ({ yearsOfService, isDisability, expected }) => {
            const deduction = calcRetirementIncomeDeduction({
              yearsOfService,
              isDisability
            });
            expect(deduction).toBe(expected);
          }
        );
      });
      describe("障害者になったことが直接の原因ではない場合は100万円を加える", () => {
        test.each`
          yearsOfService | isDisability | expected
          ${21}          | ${true}      | ${9_700_000}
          ${30}          | ${true}      | ${16_000_000}
        `(
          "$yearsOfService年 isDisability:$isDisability-> $expected",
          ({ yearsOfService, isDisability, expected }) => {
            const deduction = calcRetirementIncomeDeduction({
              yearsOfService,
              isDisability
            });
            expect(deduction).toBe(expected);
          }
        );
      });
    });
  });
});
