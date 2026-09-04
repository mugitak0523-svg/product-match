import { describe, expect, it } from "vitest";
import { loginSchema, safeNextPath, signupSchema } from "@/lib/auth/validation";
import { authErrorNotice, notifications } from "@/lib/notifications";

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

  it("uses a safe notification code for authentication errors", () => {
    expect(authErrorNotice(new Error("Invalid login credentials"))).toBe("invalid-credentials");
    expect(authErrorNotice(new Error("Database error saving new user"))).toBe("auth-failed");
    expect(notifications[authErrorNotice(new Error("Database error saving new user"))].message).not.toContain("Database error");
  });
});
