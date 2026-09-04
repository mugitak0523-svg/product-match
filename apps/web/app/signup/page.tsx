import Link from "next/link";
import { signUp } from "@/app/actions/auth";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <div className="page-shell"><section className="panel auth-card"><span className="eyebrow">Join Product Match</span><h2>Create your account</h2>{error && <p className="form-message">{error}</p>}<form action={signUp} className="form"><div className="field"><label>Display name</label><input name="displayName" required maxLength={60}/></div><div className="field"><label>Email</label><input name="email" type="email" required /></div><div className="field"><label>Password</label><input name="password" type="password" minLength={8} required /></div><button className="button button-accent">Create account</button></form><p className="muted">Already a member? <Link href="/login">Sign in</Link></p></section></div>;
}
