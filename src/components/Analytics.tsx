import Script from "next/script";

/*
  Google Analytics 4. The Measurement ID is a public identifier (it is
  printed in every page's HTML), so it is safe to keep here as the
  fallback; NEXT_PUBLIC_GA_MEASUREMENT_ID can override it per deployment.
  Renders nothing until an ID is set.
*/
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

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
