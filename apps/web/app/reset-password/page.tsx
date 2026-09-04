import { resetPassword } from "@/app/actions/password";

export default function ResetPasswordPage() {
  return <div className="page-shell"><section className="panel auth-card"><span className="eyebrow">Password reset</span><h2>Create a new password</h2><p className="muted">Use at least 8 characters.</p><form action={resetPassword} className="form"><div className="field"><label htmlFor="password">New password</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required /></div><div className="field"><label htmlFor="confirmPassword">Confirm new password</label><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={72} required /></div><button className="button button-accent">Set new password</button></form></section></div>;
}
