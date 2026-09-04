import Link from "next/link";
import { signInWithEmail, signInWithOAuth } from "@/app/actions/auth";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const query = await searchParams;
  return <div className="page-shell"><section className="panel auth-card"><span className="eyebrow">Welcome back</span><h2>Enter the arena</h2><p className="muted">Sign in to cast your vote and discover new products.</p>{query.error && <p className="form-message">{query.error}</p>}{query.message && <p className="form-message">{query.message}</p>}<form action={signInWithOAuth.bind(null, "google")}><button className="button button-light" style={{width:"100%"}}>Continue with Google</button></form><form action={signInWithOAuth.bind(null, "github")}><button className="button button-ghost" style={{width:"100%",marginTop:10}}>Continue with GitHub</button></form><div className="divider">or</div><form action={signInWithEmail} className="form"><div className="field"><label>Email</label><input name="email" type="email" required /></div><div className="field"><label>Password</label><input name="password" type="password" required /></div><button className="button button-accent">Sign in</button></form><p className="muted">New here? <Link href="/signup">Create an account</Link></p></section></div>;
}
