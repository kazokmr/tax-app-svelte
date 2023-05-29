import type { Actions } from "@sveltejs/kit";

type CalcTaxParams = {
  yearsOfService: number;
  isDisability: boolean;
  isOfficer: boolean;
  severancePay: number;
};

export const actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData();
    const calcTaxParams = {
      yearsOfService: Number(data.get("yearsOfService")),
      isDisability: Boolean(data.get("isDisability")),
      isOfficer: Boolean(data.get("isOfficer")),
      severancePay: Number(data.get("severancePay"))
    } satisfies CalcTaxParams;

    const res = await fetch("http://localhost:3000/calc-tax", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(calcTaxParams)
    });
    const item = await res.json();
    return { item, success: true };
  }
} satisfies Actions;
