// Login gate for the whole site. Everyone signs in with their own username
// and password (see netlify/functions/auth.mjs). SITE_PASSWORD in Netlify's
// environment variables is the signing key for sessions and Andy's original
// password, never stored in the code.
import { readSession } from "../lib/session.js";

const PUBLIC = new Set(["/login.html", "/signup.html", "/icon.svg", "/icon-180.png", "/icon-192.png", "/icon-512.png", "/manifest.webmanifest"]);
const OPEN_API = new Set(["/api/login", "/api/signup", "/api/logout"]);

export default async (req, context) => {
  const url = new URL(req.url);
  const secret = Netlify.env.get("SITE_PASSWORD");
  if (!secret) return new Response("Set SITE_PASSWORD in Netlify → Site configuration → Environment variables, then redeploy.", { status: 500 });

  if (PUBLIC.has(url.pathname) || OPEN_API.has(url.pathname)) return context.next();
  if (await readSession(req, secret)) return context.next();
  if (url.pathname.startsWith("/api/")) return new Response(JSON.stringify({ error: "login" }), { status: 401, headers: { "content-type": "application/json" } });
  return new Response(null, { status: 302, headers: { location: "/login.html" } });
};

export const config = { path: "/*" };
