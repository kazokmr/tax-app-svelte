import { describe, expect, test } from "vitest";
import {
  calcRetirementIncomeDeduction,
  calcRetirementIncomeTax,
  calcRetirementTotalTax,
  calcTaxableRetirementIncome
} from "./calcTax";

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

describe("課税退職所得金額", () => {
  describe("役員等の退職金", () => {
    describe("役員等の勤続年数が5年以下", () => {
      test.each`
        isOfficer | yearsOfService | severancePay | retirementIncomeDeduction | expected
        ${true}   | ${5}           | ${3_000_000} | ${2_000_000}              | ${1_000_000}
        ${true}   | ${5}           | ${3_000_999} | ${2_000_000}              | ${1_000_000}
        ${true}   | ${5}           | ${3_001_000} | ${2_000_000}              | ${1_001_000}
        ${true}   | ${5}           | ${1_000_000} | ${2_000_000}              | ${0}
      `(
        "退職金: $severancePay円 - 退職所得控除額: $retirementIncomeDeduction円 -> $expected円",
        ({ isOfficer, yearsOfService, severancePay, retirementIncomeDeduction, expected }) => {
          const income = calcTaxableRetirementIncome({
            isOfficer,
            yearsOfService,
            severancePay,
            retirementIncomeDeduction
          });
          expect(income).toBe(expected);
        }
      );
    });
    describe("役員等の勤続年数が5年を超える", () => {
      test.each`
        isOfficer | yearsOfService | severancePay | retirementIncomeDeduction | expected
        ${true}   | ${6}           | ${3_000_000} | ${2_400_000}              | ${300_000}
        ${true}   | ${6}           | ${3_001_999} | ${2_400_000}              | ${300_000}
        ${true}   | ${6}           | ${3_002_000} | ${2_400_000}              | ${301_000}
        ${true}   | ${6}           | ${1_000_000} | ${2_400_000}              | ${0}
      `(
        "(退職金: $severancePay円 - 退職所得控除額: $retirementIncomeDeduction円) * 1/2 -> $expected円",
        ({ isOfficer, yearsOfService, severancePay, retirementIncomeDeduction, expected }) => {
          const income = calcTaxableRetirementIncome({
            isOfficer,
            yearsOfService,
            severancePay,
            retirementIncomeDeduction
          });
          expect(income).toBe(expected);
        }
      );
    });
  });
  describe("役員等以外の退職金", () => {
    describe("役員等以外の勤続年数が5年以下", () => {
      describe("退職金の額から退職所得控除額を差し引いた残額が300万円以下", () => {
        test.each`
          isOfficer | yearsOfService | severancePay | retirementIncomeDeduction | expected
          ${false}  | ${5}           | ${3_000_000} | ${2_000_000}              | ${500_000}
          ${false}  | ${5}           | ${5_000_000} | ${2_000_000}              | ${1_500_000}
          ${false}  | ${5}           | ${3_001_999} | ${2_000_000}              | ${500_000}
          ${false}  | ${5}           | ${3_002_000} | ${2_000_000}              | ${501_000}
          ${false}  | ${5}           | ${1_000_000} | ${2_000_000}              | ${0}
        `(
          "(退職金: $severancePay円 - 退職所得控除額: $retirementIncomeDeduction円) * 1/2 -> $expected円",
          ({ isOfficer, yearsOfService, severancePay, retirementIncomeDeduction, expected }) => {
            const income = calcTaxableRetirementIncome({
              isOfficer,
              yearsOfService,
              severancePay,
              retirementIncomeDeduction
            });
            expect(income).toBe(expected);
          }
        );
      });
      describe("退職金の額から退職所得控除額を差し引いた残額が300万円を超える", () => {
        test.each`
          isOfficer | yearsOfService | severancePay | retirementIncomeDeduction | expected
          ${false}  | ${5}           | ${6_000_000} | ${2_000_000}              | ${2_500_000}
          ${false}  | ${5}           | ${6_001_999} | ${2_000_000}              | ${2_501_000}
          ${false}  | ${5}           | ${6_002_000} | ${2_000_000}              | ${2_502_000}
        `(
          "150万円 + (退職金: $severancePay円 - (300万円 + 退職所得控除額: $retirementIncomeDeduction円))",
          ({ isOfficer, yearsOfService, severancePay, retirementIncomeDeduction, expected }) => {
            const income = calcTaxableRetirementIncome({
              isOfficer,
              yearsOfService,
              severancePay,
              retirementIncomeDeduction
            });
            expect(income).toBe(expected);
          }
        );
      });
    });
    describe("役員等以外の勤続年数が5年を超える", () => {
      test.each`
        isOfficer | yearsOfService | severancePay | retirementIncomeDeduction | expected
        ${false}  | ${6}           | ${3_000_000} | ${2_400_000}              | ${300_000}
        ${false}  | ${6}           | ${3_001_999} | ${2_400_000}              | ${300_000}
        ${false}  | ${6}           | ${3_002_000} | ${2_400_000}              | ${301_000}
        ${false}  | ${6}           | ${1_000_000} | ${2_400_000}              | ${0}
      `(
        "(退職金: $severancePay円 - 退職所得控除額: $retirementIncomeDeduction円) * 1/2 -> $expected円",
        ({ isOfficer, yearsOfService, severancePay, retirementIncomeDeduction, expected }) => {
          const income = calcTaxableRetirementIncome({
            isOfficer,
            yearsOfService,
            severancePay,
            retirementIncomeDeduction
          });
          expect(income).toBe(expected);
        }
      );
    });
  });
});

describe("令和４年分　所得税額", () => {
  describe("課税退職所得金額が 1_000円未満 -> 所得税額 0円", () => {
    test.each`
      taxableRetirementIncome | expected
      ${0}                    | ${0}
    `(
      "課税退職所得金額: $taxableRetirementIncome円 -> 所得税額: $expected円",
      ({ taxableRetirementIncome, expected }) => {
        const incomeTax = calcRetirementIncomeTax({ taxableRetirementIncome });
        expect(incomeTax).toBe(expected);
      }
    );
  });
  describe("課税退職所得金額が 1_950_000円未満 -> 税率 5% 控除額 0円", () => {
    test.each`
      taxableRetirementIncome | expected
      ${1_000}                | ${50}
      ${1_949_000}            | ${97_450}
    `(
      "課税退職所得金額: $taxableRetirementIncome円 * 税率: 5% - 控除額: 0円 -> 所得税額: $expected円",
      ({ taxableRetirementIncome, expected }) => {
        const incomeTax = calcRetirementIncomeTax({ taxableRetirementIncome });
        expect(incomeTax).toBe(expected);
      }
    );
  });
  describe("課税退職所得金額が 3_300_000円未満 -> 税率 10% 控除額 97_500円", () => {
    test.each`
      taxableRetirementIncome | expected
      ${1_950_000}            | ${97_500}
      ${3_299_000}            | ${232_400}
    `(
      "課税退職所得金額: $taxableRetirementIncome円 * 税率: 10% - 控除額: 97_500円 -> 所得税額: $expected円",
      ({ taxableRetirementIncome, expected }) => {
        const incomeTax = calcRetirementIncomeTax({ taxableRetirementIncome });
        expect(incomeTax).toBe(expected);
      }
    );
  });
  describe("課税退職所得金額が 6_950_000円未満 -> 税率 20% 控除額 427_500円", () => {
    test.each`
      taxableRetirementIncome | expected
      ${3_300_000}            | ${232_500}
      ${6_949_000}            | ${962_300}
    `(
      "課税退職所得金額: $taxableRetirementIncome円 * 税率: 20% - 控除額: 427_500円 -> 所得税額: $expected円",
      ({ taxableRetirementIncome, expected }) => {
        const incomeTax = calcRetirementIncomeTax({ taxableRetirementIncome });
        expect(incomeTax).toBe(expected);
      }
    );
  });
  describe("課税退職所得金額が 9_000_000円未満 -> 税率 23% 控除額 636_000円", () => {
    test.each`
      taxableRetirementIncome | expected
      ${6_950_000}            | ${962_500}
      ${8_999_000}            | ${1_433_770}
    `(
      "課税退職所得金額: $taxableRetirementIncome円 * 税率: 23% - 控除額: 636_000円 -> 所得税額: $expected円",
      ({ taxableRetirementIncome, expected }) => {
        const incomeTax = calcRetirementIncomeTax({ taxableRetirementIncome });
        expect(incomeTax).toBe(expected);
      }
    );
  });
  describe("課税退職所得金額が 18_000_000円未満 -> 税率 33% 控除額 1_536_000円", () => {
    test.each`
      taxableRetirementIncome | expected
      ${9_000_000}            | ${1_434_000}
      ${17_999_000}           | ${4_403_670}
    `(
      "課税退職所得金額: $taxableRetirementIncome円 * 税率: 33% - 控除額: 1_536_000円 -> 所得税額: $expected円",
      ({ taxableRetirementIncome, expected }) => {
        const incomeTax = calcRetirementIncomeTax({ taxableRetirementIncome });
        expect(incomeTax).toBe(expected);
      }
    );
  });
  describe("課税退職所得金額が 40_000_000円未満 -> 税率 40% 控除額 2_796_000円", () => {
    test.each`
      taxableRetirementIncome | expected
      ${18_000_000}           | ${4_404_000}
      ${39_999_000}           | ${13_203_600}
    `(
      "課税退職所得金額: $taxableRetirementIncome円 * 税率: 40% - 控除額: 2_796_000円 -> 所得税額: $expected円",
      ({ taxableRetirementIncome, expected }) => {
        const incomeTax = calcRetirementIncomeTax({ taxableRetirementIncome });
        expect(incomeTax).toBe(expected);
      }
    );
  });
  describe("課税退職所得金額が 40_000_000円以上 -> 税率 45% 控除額 4_796_000円", () => {
    test.each`
      taxableRetirementIncome | expected
      ${40_000_000}           | ${13_204_000}
      ${50_000_000}           | ${17_704_000}
    `(
      "課税退職所得金額: $taxableRetirementIncome円 * 税率: 45% - 控除額: 4_796_000円 -> 所得税額: $expected円",
      ({ taxableRetirementIncome, expected }) => {
        const incomeTax = calcRetirementIncomeTax({ taxableRetirementIncome });
        expect(incomeTax).toBe(expected);
      }
    );
  });
});

describe("退職金の所得税及び復興特別所得税の源泉徴収税額", () => {
  test.each`
    retirementIncomeTax | expected
    ${0}                | ${0}
    ${50}               | ${51}
    ${120}              | ${122}
    ${1000}             | ${1021}
  `(
    "所得税: $retirementIncomeTax + 復興特別所得税: $retirementIncomeTax * 2.1% -> $expected (1円未満切り捨て)",
    ({ retirementIncomeTax, expected }) => {
      const totalTax = calcRetirementTotalTax({ retirementIncomeTax });
      expect(totalTax).toBe(expected);
    }
  );
});
