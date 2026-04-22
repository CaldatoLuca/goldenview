"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/actions/locale";
import type { Locale } from "@/i18n/request";

const flags: Record<Locale, string> = {
  it: "🇮🇹",
  en: "🇬🇧",
};

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const otherLocale: Locale = locale === "it" ? "en" : "it";

  const handleSwitch = () => {
    startTransition(async () => {
      await setLocale(otherLocale);
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      title={t("switch")}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
    >
      <span className="text-base">{flags[otherLocale]}</span>
      <span>{t(otherLocale)}</span>
    </button>
  );
}
