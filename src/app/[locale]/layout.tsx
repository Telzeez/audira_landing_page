import CookieConsentBanner from "@/components/CookieConsentBanner";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // You can use locale for data fetching or client components if needed
  return (
    <>
      {children}
      <CookieConsentBanner />
    </>
  );
}
