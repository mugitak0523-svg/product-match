import Link from "next/link";
import { Swords } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="site-header">
      <Link href="/" className="brand"><span className="brand-mark"><Swords size={18} /></span>Product Match</Link>
      <nav>
        <Link href="/discover">Discover</Link><Link href="/arenas">Arenas</Link><Link href="/rankings">Rankings</Link>
      </nav>
      <div className="header-actions">
        <Link className="button button-ghost" href="/submit">Submit product</Link>
        <Link className="avatar-link" href={user ? "/dashboard" : "/login"}>{user ? (user.email?.[0] ?? "M").toUpperCase() : "Sign in"}</Link>
      </div>
    </header>
  );
}
