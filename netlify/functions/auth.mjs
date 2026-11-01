// Sign up, log in and log out. Accounts live in Netlify Blobs (store "users"),
// keyed by username, with scrypt-hashed passwords.
//
// Environment variables:
//   SITE_PASSWORD  required. Signs sessions, and is Andy's password the first
//                  time he logs in as "andy" (his account is then created).
//   INVITE_CODE    optional. If set, new people need it to sign up.
//                  If not set, anyone who finds the site can sign up.
import { getStore } from "@netlify/blobs";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { USER_RE, loginCookies, logoutCookies, redirect } from "../lib/session.js";

const OWNER = "andy"; // the original single user; his saved progress is already under this name
const hash = (pw, salt) => scryptSync(pw, Buffer.from(salt, "hex"), 64).toString("hex");
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };
const users = () => getStore({ name: "users", consistency: "strong" });
const newRecord = pw => { const salt = randomBytes(16).toString("hex"); return { salt, hash: hash(pw, salt), created: new Date().toISOString() }; };

async function login(form, secret) {
  const user = String(form.get("username") || "").trim().toLowerCase();
  const pw = String(form.get("password") || "");
  const back = `/login.html?e=1&u=${encodeURIComponent(user)}`;
  if (!USER_RE.test(user) || !pw) return redirect(back);
  const store = users();
  let rec = await store.get(user, { type: "json" });
  if (!rec && user === OWNER && same(pw, secret)) {
    rec = newRecord(pw); // first login after the switch to usernames
    await store.setJSON(user, rec);
  }
  if (!rec || !same(hash(pw, rec.salt), rec.hash)) return redirect(back);
  return redirect("/", await loginCookies(user, secret));
}

async function signup(form, secret) {
  const user = String(form.get("username") || "").trim().toLowerCase();
  const pw = String(form.get("password") || "");
  const pw2 = String(form.get("confirm") || "");
  const invite = process.env.INVITE_CODE;
  const back = code => redirect(`/signup.html?e=${code}&u=${encodeURIComponent(user)}`);
  if (!USER_RE.test(user)) return back("name");
  if (pw.length < 8) return back("short");
  if (pw !== pw2) return back("match");
  if (invite && !same(String(form.get("invite") || "").trim(), invite)) return back("invite");
  if (user === OWNER) return back("taken"); // reserved: Andy logs in with his existing password
  const store = users();
  if (await store.get(user)) return back("taken");
  await store.setJSON(user, newRecord(pw));
  return redirect("/", await loginCookies(user, secret));
}

export default async req => {
  const secret = process.env.SITE_PASSWORD;
  if (!secret) return new Response("SITE_PASSWORD is not set.", { status: 500 });
  const path = new URL(req.url).pathname;
  if (path === "/api/logout") return redirect("/login.html", logoutCookies());
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const form = await req.formData();
  if (path === "/api/login") return login(form, secret);
  if (path === "/api/signup") return signup(form, secret);
  return new Response("Not found", { status: 404 });
};

export const config = { path: ["/api/login", "/api/signup", "/api/logout"] };
