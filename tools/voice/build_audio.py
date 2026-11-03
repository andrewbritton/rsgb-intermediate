"""Build every Cori clip the app plays, plus public/audio/manifest.json.

    node tools/voice/export_content.cjs > /tmp/content.json
    python3 tools/voice/build_audio.py /tmp/content.json

Only clips whose text has changed are re-rendered, so re-running after an edit is quick.

Clip keys (the app looks these up in the manifest):
  L:<lesson>:<n>      lesson paragraph n
  Q:<id>:q            question stem
  Q:<id>:o<n>         option n (0 = correct), without its letter
  Q:<id>:o<n>:<L>     short options only: spoken together with "Option L," (alone they garble)
  Q:<id>:a:<L>        short right answers only: "The answer is Option L, ..."
  Q:<id>:x            explanation
  Q:<id>:h            memory hook ("Memory hook: ...")
  opt:<L>             "Option L,"
  ans:<L>             "The answer is Option L,"
Each entry stores a hash of the app text it was made from, so the app can fall back to the
phone voice if a question is edited and its clip is out of date.
"""
import hashlib, json, re, sys, time
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import convert, cori  # noqa: E402

ROOT = HERE.parent.parent
AUDIO = ROOT / "public" / "audio"
MANIFEST = AUDIO / "manifest.json"
LETTERS = "ABCD"


def fnv1a(s):
    """32-bit FNV-1a of the UTF-16 code units, matching the app's JavaScript."""
    b = s.encode("utf-16-le")
    h = 0x811C9DC5
    for i in range(0, len(b), 2):
        h ^= b[i] | (b[i + 1] << 8)
        h = (h * 0x01000193) & 0xFFFFFFFF
    return format(h, "08x")


def short(script):
    return len(re.sub(r"\[\[.*?\]\]", "x", script).split()) <= 2


def jobs(content):
    """Yield (key, source text for the hash, Cori script)."""
    for L in LETTERS:
        yield f"opt:{L}", f"opt:{L}", f"Option {L},"
        yield f"ans:{L}", f"ans:{L}", f"The answer is Option {L},"
    for les in content["lessons"]:
        for n, p in enumerate(les["body"]):
            yield f"L:{les['id']}:{n}", p, convert.spoken(p)
    for q in content["questions"]:
        qid = q["id"]
        yield f"Q:{qid}:q", q["q"], convert.stem(q["q"])
        for n, o in enumerate(q["opts"]):
            full = convert.option("A", o)                      # "Option A, ^ body." / "Option A, body."
            body = re.sub(r"^Option A,( \^)?\s*", "", full)
            if full.startswith("Option A, ^") or full.startswith("Option A, the prefix"):
                yield f"Q:{qid}:o{n}", o, body
            if not full.startswith("Option A, ^"):                # short or prefix answers: letter baked in
                for L in LETTERS:
                    yield f"Q:{qid}:o{n}:{L}", o, convert.option(L, o)
                    if n == 0:                                    # and Car mode's "The answer is …"
                        yield f"Q:{qid}:a:{L}", o, "The answer is " + convert.option(L, o)
        yield f"Q:{qid}:x", q["x"], convert.spoken(q["x"])
        if q.get("hook"):
            yield f"Q:{qid}:h", q["hook"], convert.hook(q["hook"])


def rel_path(key):
    return key.replace(":", "/").replace("opt/", "labels/opt-").replace("ans/", "labels/ans-") + ".mp3"


def main(content_path, shard=None):
    """shard = (k, n): render only every n-th clip starting at k (run n of these in parallel),
    recording what was made in .cache-k.json; then run once without a shard to write the manifest."""
    content = json.loads(Path(content_path).read_text())
    old = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    for c in AUDIO.glob(".cache-*.json"):
        old.update(json.loads(c.read_text()))
    new, made, t0 = {}, 0, time.time()
    all_jobs = list(jobs(content))
    mine = all_jobs if shard is None else all_jobs[shard[0]::shard[1]]
    cache = AUDIO / f".cache-{shard[0] if shard else 'main'}.json"
    for i, (key, source, script) in enumerate(mine, 1):
        sh = hashlib.sha1(script.encode()).hexdigest()[:10]
        rel = rel_path(key)
        prev = old.get(key)
        if not (prev and prev.get("s") == sh and (AUDIO / rel).exists()):
            cori.render_mp3(script, AUDIO / rel)
            made += 1
        new[key] = {"f": rel, "h": fnv1a(source), "s": sh}
        if i % 50 == 0:
            AUDIO.mkdir(parents=True, exist_ok=True)
            cache.write_text(json.dumps(new))
            print(f"{i}/{len(mine)} done, {made} rendered, {time.time() - t0:.0f}s", flush=True)
    AUDIO.mkdir(parents=True, exist_ok=True)
    if shard is None:
        MANIFEST.write_text(json.dumps(new, separators=(",", ":"), ensure_ascii=False))
        for c in AUDIO.glob(".cache-*.json"):
            c.unlink()
    else:
        cache.write_text(json.dumps(new))
    print(f"finished: {len(new)} clips, {made} rendered, {time.time() - t0:.0f}s", flush=True)


if __name__ == "__main__":
    shard = tuple(int(x) for x in sys.argv[2].split("/")) if len(sys.argv) > 2 else None
    main(sys.argv[1], shard)
