import { handleURL } from "./utils.ts";

const cache = await caches.open("pax-cache");
const isDev = !Deno.env.get("DENO_DEPLOYMENT_ID");

async function handleConn(req: Request) {
  console.log("Accessed:", req.url);

  const cached = await cache.match(req);
  if (cached) {
    return cached;
  }

  const [body, init] = await handleURL(req.url);

  if (isDev) {
    const { pathname } = new URL(req.url);
    if (pathname !== "/") {
      // debug output
      return new Response(JSON.stringify(init));
    }
  }

  const res = new Response(body, init);
  await cache.put(req, res.clone());
  return res;
}

Deno.serve(handleConn);
