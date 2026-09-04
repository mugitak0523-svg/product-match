import { Swords } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const [supabase, t] = await Promise.all([createClient(), getTranslations("Navigation")]);
  const { data: { user } } = await supabase.auth.getUser();
  return <header className="site-header"><Link href="/" className="brand"><span className="brand-mark"><Swords size={18} /></span>Product Match</Link><nav><Link href="/discover">{t("discover")}</Link><Link href="/arenas">{t("arenas")}</Link><Link href="/rankings">{t("rankings")}</Link></nav><div className="header-actions"><LanguageSwitcher /><Link className="button button-ghost" href="/submit">{t("submit")}</Link><Link className="avatar-link" href={user ? "/dashboard" : "/login"}>{user ? (user.email?.[0] ?? "M").toUpperCase() : t("signIn")}</Link></div></header>;
}
