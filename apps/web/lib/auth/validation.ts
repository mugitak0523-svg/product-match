import { z } from "zod";

const email = z.string().trim().email("有効なメールアドレスを入力してください").max(255);
const password = z.string().min(8, "パスワードは8文字以上にしてください").max(72, "パスワードは72文字以内にしてください");

export const loginSchema = z.object({ email, password });
export const signupSchema = z.object({
  email,
  password,
  displayName: z.string().trim().min(2, "表示名は2文字以上にしてください").max(60, "表示名は60文字以内にしてください"),
});

export function safeNextPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/discover";
  return value;
}

export function authErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "認証に失敗しました。もう一度お試しください。";
  if (/invalid login credentials/i.test(message)) return "メールアドレスまたはパスワードが正しくありません。";
  if (/email not confirmed/i.test(message)) return "確認メール内のリンクを開いてからログインしてください。";
  if (/already registered/i.test(message)) return "このメールアドレスは既に登録されています。";
  return message;
}
