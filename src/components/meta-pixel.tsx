import Script from "next/script";

type MetaPixelProps = {
  pixelId?: string;
};

export function MetaPixel({ pixelId }: MetaPixelProps) {
  const trimmedPixelId = pixelId?.trim();

  if (!trimmedPixelId) {
    return null;
  }

  const pixelIdJson = JSON.stringify(trimmedPixelId);
  const noscriptSrc = `https://www.facebook.com/tr?id=${encodeURIComponent(
    trimmedPixelId,
  )}&ev=PageView&noscript=1`;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', ${pixelIdJson});
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={noscriptSrc}
          alt=""
        />
      </noscript>
    </>
  );
}
