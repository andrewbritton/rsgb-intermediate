// Password gate for the whole site. The password lives in the SITE_PASSWORD
// environment variable in Netlify, never in the code.
const PUBLIC = new Set(["/login.html", "/icon.svg", "/icon-180.png", "/icon-192.png", "/icon-512.png", "/manifest.webmanifest"]);
const YEAR = 60 * 60 * 24 * 365;

async function tokenFor(pw) {
  const data = new TextEncoder().encode(pw + "::rsgb-int-v1");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
const cookie = (req, name) => (req.headers.get("cookie") || "").split(/;\s*/).map(c => c.split("=")).find(([k]) => k === name)?.[1];

export default async (req, context) => {
  const url = new URL(req.url);
  const pw = Netlify.env.get("SITE_PASSWORD");
  if (!pw) return new Response("Set SITE_PASSWORD in Netlify → Site configuration → Environment variables, then redeploy.", { status: 500 });
  const good = await tokenFor(pw);

  if (url.pathname === "/api/login" && req.method === "POST") {
    const form = await req.formData();
    if (await tokenFor(String(form.get("password") || "")) === good) {
      return new Response(null, { status: 303, headers: { location: "/", "set-cookie": `rt=${good}; Path=/; Max-Age=${YEAR}; HttpOnly; Secure; SameSite=Lax` } });
    }
    return new Response(null, { status: 303, headers: { location: "/login.html?e=1" } });
  }
  if (url.pathname === "/api/logout") {
    return new Response(null, { status: 303, headers: { location: "/login.html", "set-cookie": "rt=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax" } });
  }
  if (PUBLIC.has(url.pathname)) return context.next();
  if (cookie(req, "rt") === good) return context.next();
  if (url.pathname.startsWith("/api/")) return new Response(JSON.stringify({ error: "login" }), { status: 401, headers: { "content-type": "application/json" } });
  return new Response(null, { status: 302, headers: { location: "/login.html" } });
};

export const config = { path: "/*" };
