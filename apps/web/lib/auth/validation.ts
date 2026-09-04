import { z } from "zod";

const email = z.string().trim().email("有効なメールアドレスを入力してください").max(255);
const password = z.string().min(8, "パスワードは8文字以上にしてください").max(72, "パスワードは72文字以内にしてください");

export const loginSchema = z.object({ email, password });
export const signupSchema = z.object({
  email,
  password,
});
export const resetPasswordRequestSchema = z.object({ email });
export const resetPasswordSchema = z.object({
  password,
  confirmPassword: password,
}).refine((value) => value.password === value.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

export function safeNextPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/discover";
  return value;
}
