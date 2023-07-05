import {
  calcIncomeTaxForSeverancePay,
  calcRetirementIncomeDeduction,
  calcRetirementIncomeTax,
  calcRetirementTotalTax,
  calcTaxableRetirementIncome,
} from "./calcTax";
import { describe, expect, test } from "vitest";

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
              isDisability,
            });
            expect(deduction).toBe(expected);
          },
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
              isDisability,
            });
            expect(deduction).toBe(expected);
          },
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
              isDisability,
            });
            expect(deduction).toBe(expected);
          },
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
              isDisability,
            });
            expect(deduction).toBe(expected);
          },
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
              isDisability,
            });
            expect(deduction).toBe(expected);
          },
        );
      });
      describe("障害者になったことが直接の原因の場合は100万円を加える", () => {
        test.each`
          yearsOfService | isDisability | expected
          ${21}          | ${true}      | ${9_700_000}
          ${30}          | ${true}      | ${16_000_000}
        `(
          "$yearsOfService年 isDisability:$isDisability-> $expected",
          ({ yearsOfService, isDisability, expected }) => {
            const deduction = calcRetirementIncomeDeduction({
              yearsOfService,
              isDisability,
            });
            expect(deduction).toBe(expected);
          },
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
            retirementIncomeDeduction,
          });
          expect(income).toBe(expected);
        },
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
            retirementIncomeDeduction,
          });
          expect(income).toBe(expected);
        },
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
              retirementIncomeDeduction,
            });
            expect(income).toBe(expected);
          },
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
              retirementIncomeDeduction,
            });
            expect(income).toBe(expected);
          },
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
            retirementIncomeDeduction,
          });
          expect(income).toBe(expected);
        },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
    },
  );
});

describe("退職金の所得税額", () => {
  test.each`
    yearsOfService | isDisability | isOfficer | severancePay | expected
    ${5}           | ${false}     | ${false}  | ${8_000_000} | ${482_422}
    ${10}          | ${false}     | ${false}  | ${8_000_000} | ${104_652}
    ${5}           | ${true}      | ${false}  | ${8_000_000} | ${278_222}
    ${10}          | ${true}      | ${false}  | ${8_000_000} | ${76_575}
    ${5}           | ${false}     | ${true}   | ${8_000_000} | ${788_722}
    ${10}          | ${false}     | ${true}   | ${8_000_000} | ${104_652}
    ${5}           | ${true}      | ${true}   | ${8_000_000} | ${584_522}
    ${10}          | ${true}      | ${true}   | ${8_000_000} | ${76_575}
  `(
    "勤続年数 $yearsOfService年・障害者となったことに直接起因して退職: $isDisability・ " +
      "役員等: $isOfficer・退職金 $severancePay円 -> $expected円",
    ({ yearsOfService, isDisability, isOfficer, severancePay, expected }) => {
      const tax = calcIncomeTaxForSeverancePay({
        yearsOfService,
        isDisability,
        isOfficer,
        severancePay,
      });
      expect(tax).toBe(expected);
    },
  );
  describe("入力値バリデーション", () => {
    describe("勤続年数は1以上100以下の整数であること", () => {
      test.each`
        yearsOfService
        ${-1}
        ${0}
        ${101}
        ${10.5}
        ${null}
        ${undefined}
        ${"some string"}
      `("勤続年数 $yearsOfService年はエラー", ({ yearsOfService }) => {
        expect(() =>
          calcIncomeTaxForSeverancePay({
            yearsOfService,
            isDisability: false,
            isOfficer: false,
            severancePay: 100_000_000,
          }),
        ).toThrowError("Invalid argument.");
      });
      test.each`
        yearsOfService | expected
        ${1}           | ${39_991_549}
        ${100}         | ${4_496_484}
      `("勤続年数 $yearsOfService年は成功", ({ yearsOfService, expected }) => {
        expect(
          calcIncomeTaxForSeverancePay({
            yearsOfService,
            isDisability: false,
            isOfficer: false,
            severancePay: 100_000_000,
          }),
        ).toBe(expected);
      });
    });
    describe("退職金は0円以上1兆円以下の整数", () => {
      test.each`
        severancePay
        ${-1}
        ${1_000_000_000_001}
        ${8_000_000.1}
      `("$severancePay円はエラー", ({ severancePay }) => {
        expect(() =>
          calcIncomeTaxForSeverancePay({
            yearsOfService: 5,
            isDisability: false,
            isOfficer: false,
            severancePay,
          }),
        ).toThrowError("Invalid argument");
      });
      test.each`
        severancePay         | expected
        ${0}                 | ${0}
        ${1_000_000_000_000} | ${459_443_495_209}
      `("$severancePay円は成功", ({ severancePay, expected }) => {
        expect(
          calcIncomeTaxForSeverancePay({
            yearsOfService: 5,
            isDisability: false,
            isOfficer: false,
            severancePay,
          }),
        ).toBe(expected);
      });
    });
    describe("不正な値の場合", () => {
      test.each`
        yearsOfService
        ${null}
        ${undefined}
        ${"some string"}
      `("勤続年数: $yearsOfServiceはエラー", ({ yearsOfService }) => {
        expect(() =>
          calcIncomeTaxForSeverancePay({
            yearsOfService,
            isDisability: true,
            isOfficer: true,
            severancePay: 8_000_000,
          }),
        ).toThrowError("Invalid argument");
      });
      test.each`
        isDisability
        ${null}
        ${undefined}
        ${"some string"}
      `("障害者となったことに直接起因して退職したか: $isDisabilityはエラー", ({ isDisability }) => {
        expect(() =>
          calcIncomeTaxForSeverancePay({
            yearsOfService: 5,
            isDisability,
            isOfficer: false,
            severancePay: 8_000_000,
          }),
        ).toThrowError("Invalid argument");
      });
      test.each`
        isOfficer
        ${null}
        ${undefined}
        ${"some string"}
      `("役員等かどうか: $isOfficerはエラー", ({ isOfficer }) => {
        expect(() =>
          calcIncomeTaxForSeverancePay({
            yearsOfService: 5,
            isDisability: false,
            isOfficer,
            severancePay: 8_000_000,
          }),
        ).toThrowError("Invalid argument");
      });
      test.each`
        severancePay
        ${null}
        ${undefined}
        ${"some string"}
      `("退職金: $severancePayはエラー", ({ severancePay }) => {
        expect(() =>
          calcIncomeTaxForSeverancePay({
            yearsOfService: 5,
            isDisability: false,
            isOfficer: false,
            severancePay,
          }),
        ).toThrowError("Invalid argument");
      });
    });
    describe("プロパティが未定義の場合", () => {
      test("勤続年数が未定義の場合はエラー", () => {
        expect(() =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          calcIncomeTaxForSeverancePay({
            isDisability: false,
            isOfficer: false,
            severancePay: 8_000_000,
          }),
        ).toThrowError("Invalid argument");
      });
      test("障害者となったことに直接起因して退職しかが未定義の場合はエラー", () => {
        expect(() =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          calcIncomeTaxForSeverancePay({
            yearsOfService: 5,
            isOfficer: false,
            severancePay: 8_000_000,
          }),
        ).toThrowError("Invalid argument");
      });
      test("役員等かが未定義の場合はエラー", () => {
        expect(() =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          calcIncomeTaxForSeverancePay({
            yearsOfService: 5,
            isDisability: false,
            severancePay: 8_000_000,
          }),
        ).toThrowError("Invalid argument");
      });
      test("退職金が未定義の場合はエラー", () => {
        expect(() =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          calcIncomeTaxForSeverancePay({
            yearsOfService: 5,
            isDisability: false,
            isOfficer: false,
          }),
        ).toThrowError("Invalid argument");
      });
    });
    describe("不正なオブジェクトの場合", () => {
      test("意図していないプロパティが含まれる場合はエラー", () =>
        expect(() =>
          calcIncomeTaxForSeverancePay({
            yearsOfService: 5,
            isDisability: false,
            isOfficer: false,
            severancePay: 8_000_000,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            isPaid: true,
          }),
        ).toThrowError("Invalid argument"));
      test("空オブジェクトの場合はエラー", () =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(() => calcIncomeTaxForSeverancePay({})).toThrowError("Invalid argument"));
      test("オブジェクトではない場合はエラー", () =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(() => calcIncomeTaxForSeverancePay(8_0000)).toThrowError("Invalid argument"));
      test("undefinedの場合はエラー", () =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(() => calcIncomeTaxForSeverancePay(undefined)).toThrowError("Invalid argument"));
      test("nullの場合はエラー", () =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(() => calcIncomeTaxForSeverancePay(null)).toThrowError("Invalid argument"));
    });
  });
});
