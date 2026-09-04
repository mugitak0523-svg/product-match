"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Dropdown } from "@/components/dropdown";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Language");
  return <div className="language-switcher"><Dropdown ariaLabel={t("label")} value={locale} options={[{ value: "en", label: t("english") }, { value: "ja", label: t("japanese") }]} onChange={(value) => router.replace(pathname, { locale: value as "en" | "ja" })}/></div>;
}
