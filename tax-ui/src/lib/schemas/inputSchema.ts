import { z } from "zod";

export const inputSchema = z
  .object({
    yearsOfService: z.number().int().gte(1).lte(100).default(10),
    isDisability: z.boolean().default(false),
    isOfficer: z
      .string()
      .transform((val) => !!Number(val))
      .default("0"),
    severancePay: z.number().int().gte(0).lte(1_000_000_000_000).default(5_000_000)
  })
  .strict();

export type InputSchema = z.infer<typeof inputSchema>;
