import { NextRequest, NextResponse } from "next/server";
import { APP_DOMAIN } from "@/config/app";

const RESERVED_SUBDOMAINS = new Set(["www", "app", "api"]);

function extractSubdomain(host: string): string | null {
  const hostWithoutPort = host.split(":")[0];
  const rootHost = APP_DOMAIN.split(":")[0];

  if (hostWithoutPort === rootHost || hostWithoutPort === `www.${rootHost}`) {
    return null;
  }

  if (hostWithoutPort.endsWith(`.${rootHost}`)) {
    const subdomain = hostWithoutPort.slice(0, -`.${rootHost}`.length);
    if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain)) return null;
    return subdomain;
  }

  // local dev: e.g. riya.localhost:3000
  if (hostWithoutPort.endsWith(".localhost")) {
    const subdomain = hostWithoutPort.slice(0, -".localhost".length);
    if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain)) return null;
    return subdomain;
  }

  return null;
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname.toLowerCase();
  if (
    pathname === "/haseeb%26adeeba_events" ||
    pathname === "/haseeb_adeeba_events" ||
    pathname === "/haseeb&adeeba_events"
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/haseeb&adeeba_events";
    return NextResponse.rewrite(url);
  }

  const host = req.headers.get("host") ?? "";
  const subdomain = extractSubdomain(host);

  if (!subdomain) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/sites/${subdomain}${url.pathname}`;

  const response = NextResponse.rewrite(url);
  response.headers.set("x-wedding-slug", subdomain);
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
