type CalcRetirementIncomeDeductionInput = {
  yearsOfService: number;
  isDisability: boolean;
};

export const calcRetirementIncomeDeduction = (input: CalcRetirementIncomeDeductionInput) => {
  let deduction: number;
  if (input.yearsOfService <= 20) {
    deduction = 400_000 * input.yearsOfService;
    deduction = deduction < 800_000 ? 800_000 : deduction;
  } else {
    deduction = 8_000_000 + 700_000 * (input.yearsOfService - 20);
  }
  return input.isDisability ? deduction + 1_000_000 : deduction;
};
