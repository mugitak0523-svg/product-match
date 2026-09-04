import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { signInWithEmail, signInWithOAuth } from "@/app/actions/auth";
import { safeNextPath } from "@/lib/auth/validation";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [query, t] = await Promise.all([searchParams, getTranslations("Auth")]);
  const next = safeNextPath(query.next);
  const signupHref = next === "/discover" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`;
  return <div className="page-shell"><section className="panel auth-card"><span className="eyebrow">{t("welcome")}</span><h2>{t("loginTitle")}</h2><p className="muted">{t("loginDescription")}</p><form action={signInWithOAuth.bind(null, "google")}><input type="hidden" name="next" value={next}/><button className="button button-light" style={{ width: "100%" }}>{t("google")}</button></form><form action={signInWithOAuth.bind(null, "github")}><input type="hidden" name="next" value={next}/><button className="button button-ghost" style={{ width: "100%", marginTop: 10 }}>{t("github")}</button></form><div className="divider">{t("or")}</div><form action={signInWithEmail} className="form"><input type="hidden" name="next" value={next}/><div className="field"><label htmlFor="email">{t("email")}</label><input id="email" name="email" type="email" autoComplete="email" required /></div><div className="field"><label htmlFor="password">{t("password")}</label><input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required /></div><button className="button button-accent">{t("signIn")}</button></form><p className="muted"><Link href="/forgot-password">Forgot your password?</Link></p><p className="muted">{t("newHere")} <Link href={signupHref}>{t("createAccount")}</Link></p></section></div>;
}
