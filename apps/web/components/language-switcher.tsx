"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Language");
  return <label className="language-switcher"><span className="sr-only">{t("label")}</span><select value={locale} onChange={(event) => router.replace(pathname, { locale: event.target.value as "en" | "ja" })}><option value="en">{t("english")}</option><option value="ja">{t("japanese")}</option></select></label>;
}
