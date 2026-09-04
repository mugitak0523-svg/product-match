import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { signInWithOAuth, signUp } from "@/app/actions/auth";
import { safeNextPath } from "@/lib/auth/validation";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const [query, t] = await Promise.all([searchParams, getTranslations("Auth")]);
  const next = safeNextPath(query.next);
  const loginHref = next === "/discover" ? "/login" : `/login?next=${encodeURIComponent(next)}`;
  return <div className="page-shell"><section className="panel auth-card"><span className="eyebrow">{t("join")}</span><h2>{t("signupTitle")}</h2><p className="muted">{t("signupDescription")}</p>{query.error && <p className="form-message" role="alert">{query.error}</p>}<form action={signInWithOAuth.bind(null, "google")}><input type="hidden" name="next" value={next}/><button className="button button-light" style={{width:"100%"}}>{t("google")}</button></form><form action={signInWithOAuth.bind(null, "github")}><input type="hidden" name="next" value={next}/><button className="button button-ghost" style={{width:"100%",marginTop:10}}>{t("github")}</button></form><div className="divider">{t("orEmail")}</div><form action={signUp} className="form"><input type="hidden" name="next" value={next}/><div className="field"><label htmlFor="email">{t("email")}</label><input id="email" name="email" type="email" autoComplete="email" required /></div><div className="field"><label htmlFor="password">{t("password")}</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required /></div><button className="button button-accent">{t("createAccount")}</button></form><p className="muted">{t("alreadyMember")} <Link href={loginHref}>{t("signIn")}</Link></p></section></div>;
}
