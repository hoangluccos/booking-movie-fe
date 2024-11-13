import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .transform((val) => new Date(val)),
  email: z.string().email(),
});
export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(20, { message: "Mật khẩu không được vượt quá 20 ký tự" }),

    passwordConfirm: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(20, { message: "Mật khẩu không được vượt quá 20 ký tự" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Mật khẩu xác nhận không khớp",
        code: z.ZodIssueCode.custom,
      });
    }
  });
