import { z } from "zod";

export const inputSchema = z.object({
  yearsOfService: z
    .number({
      required_error: "勤続年数を入力してください",
      invalid_type_error: "勤続年数は１以上の整数を入力してください",
    })
    .int({ message: "整数を入力してください" })
    .gte(1, { message: "１以上の整数を入力してください" })
    .lte(100, { message: "１００以下の整数を入力してください" })
    .default("" as unknown as number),
  isDisability: z.boolean().default(false),
  isOfficer: z.string().default("0"),
  severancePay: z
    .number({
      required_error: "退職金を入力してください",
      invalid_type_error: "退職金を入力してください",
    })
    .int({ message: "１円単位で入力してください" })
    .gte(0, { message: "０円以上を入力してください" })
    .lte(1_000_000_000_000, { message: "1,000,000,000,000円までです" })
    .default("" as unknown as number),
});

export type InputSchema = z.infer<typeof inputSchema>;
