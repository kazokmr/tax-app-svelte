type CalcRetirementIncomeDeductionInput = {
  yearsOfService: number;
  isDisability: boolean;
};

export const calcRetirementIncomeDeduction = ({
  yearsOfService,
  isDisability
}: CalcRetirementIncomeDeductionInput) => {
  const deduction = () => {
    if (yearsOfService <= 20) {
      const deduction = 400_000 * yearsOfService;
      return deduction < 800_000 ? 800_000 : deduction;
    }
    return 8_000_000 + 700_000 * (yearsOfService - 20);
  };
  return isDisability ? deduction() + 1_000_000 : deduction();
};

type CalcTaxableRetirementIncome = {
  isOfficer: boolean;
  yearsOfService: number;
  severancePay: number;
  retirementIncomeDeduction: number;
};

export const calcTaxableRetirementIncome = ({
  isOfficer,
  yearsOfService,
  severancePay,
  retirementIncomeDeduction
}: CalcTaxableRetirementIncome) => {
  let paidAfterDeduction = severancePay - retirementIncomeDeduction;

  const income = () => {
    if (paidAfterDeduction < 0) {
      return 0;
    }
    if (isOfficer && yearsOfService <= 5) {
      return paidAfterDeduction;
    }
    if (!isOfficer && yearsOfService <= 5 && paidAfterDeduction > 3_000_000) {
      return 1_500_000 + (paidAfterDeduction - 3_000_000);
    }
    return paidAfterDeduction / 2;
  };

  return Math.floor(income() / 1000) * 1000;
};
