"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n } from "@/i18n/routing";
import styles from "./LocaleSwitcher.module.css";

export default function LocaleSwitcher() {
  const pathname = usePathname();

  const redirectedPathName = (locale: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale; // Replace the current locale with the new one
    return segments.join("/");
  };

  return (
    <div className={styles.switcher}>
      {i18n.locales.map((locale) => {
        const isActive = pathname?.startsWith(`/${locale}`);
        return (
          <Link
            key={locale}
            href={redirectedPathName(locale)}
            className={`${styles.localeBtn} ${isActive ? styles.active : ""}`}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
