import { describe, expect, it } from "vitest";
import { authErrorMessage, loginSchema, safeNextPath, signupSchema } from "@/lib/auth/validation";

describe("authentication input validation", () => {
  it("accepts a valid login", () => {
    expect(loginSchema.safeParse({ email: "maker@example.com", password: "password123" }).success).toBe(true);
  });

  it("rejects a short password and invalid email", () => {
    expect(loginSchema.safeParse({ email: "not-an-email", password: "short" }).success).toBe(false);
  });

  it("accepts email and password without a display name for sign-up", () => {
    expect(signupSchema.safeParse({ email: "maker@example.com", password: "password123" }).success).toBe(true);
  });

  it("allows only internal post-login paths", () => {
    expect(safeNextPath("/submit")).toBe("/submit");
    expect(safeNextPath("https://attacker.example")).toBe("/discover");
    expect(safeNextPath("//attacker.example")).toBe("/discover");
  });

  it("does not expose raw invalid-password errors", () => {
    expect(authErrorMessage(new Error("Invalid login credentials"))).toBe("メールアドレスまたはパスワードが正しくありません。");
  });
});
