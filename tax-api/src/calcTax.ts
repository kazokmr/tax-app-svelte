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

type CalcRetirementIncomeTax = {
  taxableRetirementIncome: number;
};

export const calcRetirementIncomeTax = ({ taxableRetirementIncome }: CalcRetirementIncomeTax) => {
  if (taxableRetirementIncome < 1_000) {
    return 0;
  }
  if (taxableRetirementIncome < 1_950_000) {
    return taxableRetirementIncome * 0.05;
  }
  if (taxableRetirementIncome < 3_300_000) {
    return taxableRetirementIncome * 0.1 - 97_500;
  }
  if (taxableRetirementIncome < 6_950_000) {
    return taxableRetirementIncome * 0.2 - 427_500;
  }
  if (taxableRetirementIncome < 9_000_000) {
    return taxableRetirementIncome * 0.23 - 636_000;
  }
  if (taxableRetirementIncome < 18_000_000) {
    return taxableRetirementIncome * 0.33 - 1_536_000;
  }
  if (taxableRetirementIncome < 40_000_000) {
    return taxableRetirementIncome * 0.4 - 2_796_000;
  }
  return taxableRetirementIncome * 0.45 - 4_796_000;
};
