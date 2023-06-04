import { z } from "zod";

export const inputSchema = z
  .object({
    yearsOfService: z
      .number({
        required_error: "勤続年数を入力してください",
        invalid_type_error: "勤続年数は数値で入力してください"
      })
      .int({ message: "整数で入力してください" })
      .gte(1, { message: "１以上を入力してください" })
      .lte(100)
      .default(10),
    isDisability: z
      .boolean()
      .default(false),
    isOfficer: z
      .string()
      .transform((val) => !!Number(val))
      .default("0"),
    severancePay: z
      .number({
        required_error: "退職金を入力してください",
        invalid_type_error: "退職金は数値で入力してください"
      })
      .int({ message: "１以上を入力してください" })
      .gte(0, { message: "１円以上を入力してください" })
      .lte(1_000_000_000_000, { message: "1,000,000,000,000円までです" })
      .default(5_000_000)
  })
  .strict();

export type InputSchema = z.infer<typeof inputSchema>;
