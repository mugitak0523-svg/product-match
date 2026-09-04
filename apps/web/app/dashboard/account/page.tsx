import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteAccount } from "@/app/actions/account";
import { signOut } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <div className="page-shell"><div className="dashboard-grid"><aside className="side-nav"><Link href="/dashboard">My products</Link><Link href="/submit">Submit product</Link><Link href="/dashboard/account">Account</Link><form action={signOut}><button className="button button-ghost">Sign out</button></form></aside><section className="narrow"><span className="eyebrow">Account</span><h1 style={{ fontSize: 58 }}>Account settings</h1><section className="panel"><h2>Delete account</h2><p className="muted">Your email address and OAuth identity are removed from authentication. Your profile is anonymized, your Products are archived, and your comments remain as deleted comments. Past Arena results and vote totals are preserved.</p><form action={deleteAccount} className="form" style={{ marginTop: 24 }}><div className="field"><label htmlFor="confirmation">Type DELETE to confirm</label><input id="confirmation" name="confirmation" autoComplete="off" required /></div><button className="button button-danger">Delete account</button></form></section></section></div></div>;
}
