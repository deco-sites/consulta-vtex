import { asset, Head } from "$fresh/runtime.ts";
import { defineApp } from "$fresh/server.ts";
import Theme from "../sections/Theme/Theme.tsx";
import { Context } from "@deco/deco";

export default defineApp(async (_req, ctx) => {
  const revision = await Context.active().release?.revision();
  return (
    <>
      {/* Include default fonts and css vars */}
      <Theme />

      {/* Include Icons and manifest */}
      <Head>
        {/* Enable View Transitions API */}
        <meta name="view-transition" content="same-origin" />

        {/* Tailwind v3 CSS file */}
        <link
          href={asset(`/styles.css?revision=${revision}`)}
          rel="stylesheet"
        />
        <meta name="theme-color" content="#fff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#fff" />

        {/* Web Manifest */}
        <link rel="manifest" href={asset("/site.webmanifest")} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=MKO-bn1kX3hulC7mx0nJCw&gtm_preview=env-677&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-WTG292');`,
          }}
        />
        {/* <script src="/newrelic.js"></script> */}
      </Head>

      {/* Rest of Preact tree */}
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      (function(){
        var s = document.createElement('script');
        s.src = 'https://reviews.konfidency.com.br/consultaremedios/loader.js';
        document.head.appendChild(s);
      })();
    `,
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WTG292&gtm_auth=MKO-bn1kX3hulC7mx0nJCw&gtm_preview=env-677&gtm_cookies_win=x"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <ctx.Component />
      </body>
    </>
  );
});
