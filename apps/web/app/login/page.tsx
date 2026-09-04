import Link from "next/link";
import { signInWithEmail, signInWithOAuth } from "@/app/actions/auth";
import { safeNextPath } from "@/lib/auth/validation";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const query = await searchParams;
  const next = safeNextPath(query.next);
  const signupHref = next === "/discover" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`;
  return <div className="page-shell"><section className="panel auth-card"><span className="eyebrow">Welcome back</span><h2>Enter the arena</h2><p className="muted">Sign in to cast your vote and discover new products.</p><form action={signInWithOAuth.bind(null, "google")}><input type="hidden" name="next" value={next}/><button className="button button-light" style={{ width: "100%" }}>Continue with Google</button></form><form action={signInWithOAuth.bind(null, "github")}><input type="hidden" name="next" value={next}/><button className="button button-ghost" style={{ width: "100%", marginTop: 10 }}>Continue with GitHub</button></form><div className="divider">or</div><form action={signInWithEmail} className="form"><input type="hidden" name="next" value={next}/><div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></div><div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required /></div><button className="button button-accent">Sign in</button></form><p className="muted"><Link href="/forgot-password">Forgot your password?</Link></p><p className="muted">New here? <Link href={signupHref}>Create an account</Link></p></section></div>;
}
