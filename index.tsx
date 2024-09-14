import { Marked } from "markdown";

const readme = await Deno.readTextFile("./README.md");
const corner = await Deno.readTextFile("./corner.html");
const description = "Access the modules on GitHub via Deno Deploy🦕";
const icon =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@v14.0.2/assets/72x72/1f4e6.png";
const css = "https://cdn.jsdelivr.net/npm/water.css@2/out/water.min.css";
const viewport = "width=device-width,initial-scale=1.0,minimum-scale=1.0";

const Index = () => (
  <>
    {{ __html: "<!doctype html>" }}
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>pax.deno.dev</title>
        <meta name="viewport" content={viewport} />
        <link rel="icon" type="image/png" href={icon} />
        <link rel="stylesheet" href={css} />
        <meta name="description" content={description} />
        <meta property="og:url" content="https://pax.deno.dev/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="pax.deno.dev" />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="pax.deno.dev" />
        <meta property="og:image" content={icon} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@kawarimidoll" />
      </head>
      <body>
        {{ __html: Marked.parse(readme).content }}
        {{ __html: corner }}
      </body>
    </html>
  </>
);

export default Index;
