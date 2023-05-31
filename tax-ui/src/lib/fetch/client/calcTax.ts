export type CalcTaxParam = {
  yearsOfService: number
  isDisability: boolean
  isOfficer: boolean
  severancePay: number
}

export type CalcTaxResult = {
  tax: number
}

export const calcTax = async (param: CalcTaxParam) =>
  await fetch("http://localhost:3000/calc-tax", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(param)
  });