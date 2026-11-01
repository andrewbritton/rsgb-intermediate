// Signed login sessions, shared by the edge gate and the Node functions.
// Uses only Web Crypto so it runs in both. The signing key is derived from
// SITE_PASSWORD, so changing that variable logs everyone out.
const enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");

export const YEAR = 60 * 60 * 24 * 365;
export const USER_RE = /^[a-z0-9][a-z0-9_-]{2,19}$/; // 3–20 chars, lowercase
const SESSION = "rs"; // HttpOnly, signed
const WHO = "ru";     // readable by the app, only used to keep each person's local copy apart

export const cookie = (req, name) => {
  const hit = (req.headers.get("cookie") || "").split(/;\s*/).find(c => c.startsWith(name + "="));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : undefined;
};

async function sign(secret, text) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret + "::session-v2"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(text)));
}
function sameText(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

/** The username in a valid session cookie, or null. */
export async function readSession(req, secret) {
  const v = cookie(req, SESSION);
  if (!v) return null;
  const [user, exp, sig] = v.split(".");
  if (!USER_RE.test(user || "") || !/^\d+$/.test(exp || "") || !sig) return null;
  if (+exp < Date.now() / 1000) return null;
  return sameText(await sign(secret, `${user}.${exp}`), sig) ? user : null;
}

/** Set-Cookie headers that log `user` in. */
export async function loginCookies(user, secret) {
  const exp = Math.floor(Date.now() / 1000) + YEAR;
  const value = `${user}.${exp}.${await sign(secret, `${user}.${exp}`)}`;
  return [
    `${SESSION}=${value}; Path=/; Max-Age=${YEAR}; HttpOnly; Secure; SameSite=Lax`,
    `${WHO}=${user}; Path=/; Max-Age=${YEAR}; Secure; SameSite=Lax`,
  ];
}

/** Set-Cookie headers that log out (also clears the old single-password cookie). */
export const logoutCookies = () => [SESSION, WHO, "rt"].map(n => `${n}=; Path=/; Max-Age=0; Secure; SameSite=Lax`);

export function redirect(location, cookies = []) {
  const h = new Headers({ location });
  for (const c of cookies) h.append("set-cookie", c);
  return new Response(null, { status: 303, headers: h });
}
