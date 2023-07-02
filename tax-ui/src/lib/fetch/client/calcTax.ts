import { env } from "$env/dynamic/private";

export type CalcTaxParam = {
  yearsOfService: number;
  isDisability: boolean;
  isOfficer: string;
  severancePay: number;
} & { fetch: typeof fetch };

export type CalcTaxResult = {
  tax: number;
};

export const calcTax = async ({ fetch, ...param }: CalcTaxParam) => {
  return await fetch(`http://${env.API_SERVER_HOST}:${env.API_SERVER_PORT}/calc-tax`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      ...param,
      isOfficer: !!Number(param.isOfficer)
    })
  });
};
