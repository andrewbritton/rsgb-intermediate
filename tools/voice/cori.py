"""Turn a Cori script (from convert.py) into an MP3 clip with Piper.

Script markup, on top of normal punctuation:
  [[ phonemes ]]   exact sounds (eSpeak IPA), used for stress fixes
  {text}           spoken about 30% slower; {1.15:text} sets the slowness
  ^                short fixed pause (0.15 s)
  |                longer fixed pause (0.3 s)
Full stops, colons and semicolons also get fixed pauses.
"""
import io, re, subprocess, wave
from pathlib import Path
from piper import PiperVoice, SynthesisConfig

GAP = 0.45    # after a full stop / ? / !
COLON = 0.3   # after a colon
SEMI = 0.18   # after a semicolon
PAUSE = 0.3   # explicit |
SHORT = 0.15  # explicit ^
MIN_WORDS = 4  # pieces shorter than this garble on their own, so they are joined to the next one

_voice = None


def voice(model=Path(__file__).with_name("voices") / "en_GB-cori-high.onnx"):
    global _voice
    if _voice is None:
        _voice = PiperVoice.load(str(model))
    return _voice


def pieces(text):
    # Piper drops a comma or semicolon straight after a [[ phoneme ]] block, so move it inside.
    text = re.sub(r"\s*\]\]\s*([,;])", r"\1 ]]", text)
    raw = [p for p in re.split(r"(?<=[.!?:;|^])\s+(?![^\[]*\]\])", text) if p.strip()]
    out = []
    for p in raw:
        # A very short piece ("D, PSK.") is garbled when spoken alone: keep it with its neighbour,
        # letting Piper make its own (shorter) pause instead of our fixed one.
        if out and len(re.sub(r"\[\[.*?\]\]|[{}^|]", "x", out[-1]).split()) < MIN_WORDS and not out[-1].endswith(("^", "|")):
            out[-1] = out[-1] + " " + p
        else:
            out.append(p)
    if len(out) > 1 and len(out[-1].split()) < MIN_WORDS and not out[-2].endswith(("^", "|")):
        out[-2:] = [out[-2] + " " + out[-1]]
    return out


def gap_after(p):
    if p.endswith("^"): return SHORT
    if p.endswith("|"): return PAUSE
    if p.endswith(";"): return SEMI
    if p.endswith(":"): return COLON
    return GAP


def render_wav(text):
    v = voice()
    rate = v.config.sample_rate
    buf = io.BytesIO()
    with wave.open(buf, "wb") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(rate)
        ps = pieces(text)
        for i, p in enumerate(ps):
            if i:
                f.writeframes(b"\0\0" * int(gap_after(ps[i - 1]) * rate))
            for seg in re.split(r"(\{[^}]*\})", p.rstrip("|^").rstrip()):
                if not seg.strip():
                    continue
                cfg = None
                if seg.startswith("{"):
                    seg = seg.strip("{} ")
                    m = re.match(r"(\d(?:\.\d+)?):\s*(.*)", seg)
                    scale, seg = (float(m.group(1)), m.group(2)) if m else (1.3, seg)
                    cfg = SynthesisConfig(length_scale=scale)
                for chunk in v.synthesize(seg.strip(), syn_config=cfg):
                    f.writeframes(chunk.audio_int16_bytes)
    return buf.getvalue()


def render_mp3(text, out, kbps=40):
    wav = render_wav(text)
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "wav", "-i", "-", "-ac", "1", "-b:a", f"{kbps}k", str(out)],
                   input=wav, check=True)


if __name__ == "__main__":
    import sys
    render_mp3(sys.argv[2], sys.argv[1])
