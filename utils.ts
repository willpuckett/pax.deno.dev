import Index from "./index.tsx";

export function extract(path: string) {
  const match = path.match(/^\/([^\/]+)\/([^\/@]+)(@[^\/]+)?(\/.*)?/);
  if (!match) return [];

  const [, owner, repo, atTag, file] = match;
  return [
    owner,
    repo,
    atTag ? atTag.slice(1) : "master",
    file?.replace(/^\/|\/$/g, "") || "mod.ts",
  ];
}

export async function handleURL(
  url: string,
): Promise<[string | ReadableStream<Uint8Array>, ResponseInit]> {
  const { pathname, searchParams } = new URL(url);
  if (pathname === "/") {
    return [await Index(), { headers: { "content-type": "text/html" } }];
  }

  const [owner, repo, tag, file] = extract(pathname);

  if (!owner || !repo) {
    const [status, statusText] = [400, "Invalid URL"];
    const init = { status, statusText };
    return [`${status}: ${statusText}`, init];
  }

  let host = "https://raw.githubusercontent.com";
  if (searchParams.has("d")) {
    host = "https://doc.deno.land/" + host.replace(":/", "");
  }
  const location = [host, owner, repo, tag, file].join("/");

  const body = (searchParams.has("b") && file.endsWith(".pdf"))
    ? await fetch(location).then((res) => res.body)
    : null;

  const headers: HeadersInit = body
    ? { "content-type": "application/pdf" }
    : { location };
  const [status, statusText] = body ? [200, "OK"] : [301, "Moved Permanently"];
  const init = { status, statusText, headers };

  return [body ?? `${status}: ${statusText}`, init];
}

export function parse(path: string) {
  // match example: [
  //   "https://github.com/owner/repo/blob/tag/path/to/file",
  //   "owner/repo",
  //   "/blob/tag",
  //   "blob",
  //   "tag",
  //   "/path/to/file"
  // ]
  const [, ownerRepo = "", , , tag, file = ""] = path.match(
    /^https:\/\/github\.com\/([^\/]+\/[^\/]+)(\/(tree|blob)\/([^\/]+))?(\/.*)?/,
  ) || [];
  return `https://pax.deno.dev/${ownerRepo}${tag ? "@" + tag : ""}${file}`;
}
