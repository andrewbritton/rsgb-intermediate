// Stores each person's study progress in Netlify Blobs, keyed by username,
// so their phone and computer stay in step.
import { getStore } from "@netlify/blobs";
import { readSession } from "../lib/session.js";

function merge(a = {}, b = {}) {
  const out = { v: 1, items: {}, days: {}, notes: {}, mocks: [], lessons: {}, settings: {}, u: Math.max(a.u || 0, b.u || 0) };
  out.settings = (b.u || 0) > (a.u || 0) ? { ...a.settings, ...b.settings } : { ...b.settings, ...a.settings };
  for (const s of [a, b]) {
    for (const [k, v] of Object.entries(s.items || {})) if (!out.items[k] || (v.u || 0) > (out.items[k].u || 0)) out.items[k] = v;
    for (const [k, v] of Object.entries(s.notes || {})) if (!out.notes[k] || (v.u || 0) > (out.notes[k].u || 0)) out.notes[k] = v;
    for (const [k, v] of Object.entries(s.days || {})) if (!out.days[k] || v.n > out.days[k].n) out.days[k] = v;
    for (const [k, v] of Object.entries(s.lessons || {})) out.lessons[k] = Math.max(out.lessons[k] || 0, v);
    for (const m of s.mocks || []) if (!out.mocks.some(x => x.d === m.d)) out.mocks.push(m);
  }
  out.mocks.sort((x, y) => x.d - y.d);
  return out;
}

export default async req => {
  const secret = process.env.SITE_PASSWORD;
  const user = secret && await readSession(req, secret);
  if (!user) return Response.json({ error: "login" }, { status: 401 });
  const store = getStore({ name: "progress", consistency: "strong" });
  const current = (await store.get(user, { type: "json" })) || {};
  if (req.method === "GET") return Response.json(current, { headers: { "cache-control": "no-store" } });
  if (req.method === "PUT") {
    const text = await req.text();
    if (text.length > 2_000_000) return Response.json({ error: "too big" }, { status: 413 });
    const merged = merge(current, JSON.parse(text));
    await store.setJSON(user, merged);
    return Response.json({ ok: true, u: merged.u });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/progress" };
