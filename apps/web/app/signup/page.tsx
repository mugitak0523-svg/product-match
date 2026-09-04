import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { safeNextPath } from "@/lib/auth/validation";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const query = await searchParams;
  const next = safeNextPath(query.next);
  const loginHref = next === "/discover" ? "/login" : `/login?next=${encodeURIComponent(next)}`;
  return <div className="page-shell"><section className="panel auth-card"><span className="eyebrow">Join Product Match</span><h2>Create your account</h2><p className="muted">Create an account to vote and submit products.</p>{query.error && <p className="form-message" role="alert">{query.error}</p>}<form action={signUp} className="form"><input type="hidden" name="next" value={next}/><div className="field"><label htmlFor="displayName">Display name</label><input id="displayName" name="displayName" autoComplete="name" required minLength={2} maxLength={60}/></div><div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></div><div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required /></div><button className="button button-accent">Create account</button></form><p className="muted">Already a member? <Link href={loginHref}>Sign in</Link></p></section></div>;
}
