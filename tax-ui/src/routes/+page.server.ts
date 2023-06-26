import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import type { CalcTaxResult } from "$lib/fetch/client/calcTax";
import { calcTax } from "$lib/fetch/client/calcTax";
import type { InputSchema } from "$lib/schemas/inputSchema";
import { inputSchema } from "$lib/schemas/inputSchema";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async () => {
  const form = await superValidate(inputSchema);
  return { form };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, inputSchema);
    if (!form.valid) {
      return fail(400, { form, tax: 0 });
    }
    const param = form.data as InputSchema;
    const response = await calcTax(param);
    let tax = 0;
    if (response.ok) {
      const json = (await response.json()) satisfies CalcTaxResult;
      tax = json.tax;
    } else {
      return fail(400, { form, tax: 0 });
    }
    return { form, tax };
  }
} satisfies Actions;
