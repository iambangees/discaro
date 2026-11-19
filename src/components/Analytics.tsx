import Script from "next/script";

/*
  Google Analytics 4 (direct gtag). The Measurement ID is a public
  identifier (printed in every page's HTML), so it is safe to keep here
  as the fallback; NEXT_PUBLIC_GA_MEASUREMENT_ID can override it.
  A Tag Manager container (GTM-K3ZX8TX4) also exists on the account but
  is deliberately not loaded, so pageviews are never double-counted.
*/
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-4F1MT4THQC";

export default function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
