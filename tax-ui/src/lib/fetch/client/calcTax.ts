import { env } from "$env/dynamic/private";

export type CalcTaxParam = {
  yearsOfService: number;
  isDisability: boolean;
  isOfficer: string;
  severancePay: number;
};

export type CalcTaxResult = {
  tax: number;
};

export const calcTax = async (param: CalcTaxParam) =>
  await fetch(`http://${env.API_SERVER_HOST}:${env.API_SERVER_PORT}/calc-tax`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      ...param,
      isOfficer: !!Number(param.isOfficer)
    })
  });
