import { superValidate } from "sveltekit-superforms/server";
import { inputSchema } from "$lib/schemas/inputSchema";

export const load = async () => {
  const form = await superValidate(inputSchema);
  return { form };
};
