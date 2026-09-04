import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/password";

export default function ForgotPasswordPage() {
  return <div className="page-shell"><section className="panel auth-card"><span className="eyebrow">Password reset</span><h2>Reset your password</h2><p className="muted">Enter your email address. If it is registered, we will send a reset link.</p><form action={requestPasswordReset} className="form"><div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></div><button className="button button-accent">Send reset link</button></form><p className="muted">Remembered it? <Link href="/login">Back to sign in</Link></p></section></div>;
}
