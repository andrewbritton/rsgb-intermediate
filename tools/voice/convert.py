"""Convert app text into a Cori script, following Andy's pronunciation decisions
(the 117-item review, Nov 2026). Each rule notes the review item it came from.

    spoken(text)            one paragraph, explanation, stem or option
    option(letter, text)    "Option B, ^ ..." for an answer option
"""
import re

# ── Phoneme snippets agreed in the review ──
KHZ = "[[ kˈɪləhɜːts ]]"            # 12 KILLA-hertz
KM = "[[ kˈɪləmiːtəz ]]"            # 19 KILLA-metres
DBD = "[[ diːbiː ]] [[ dˈiː ]]"     # 18 dee-bee DEE
RECORD = "[[ ɹɛkˈɔːd ]]"            # 46 rec-ORD
RATHER = "[[ ɹˌɑːðə ]]"             # 68 light 'rather'
KOHM, KOHMS = "[[ kˈɪlə əʊm ]]", "[[ kˈɪlə əʊmz ]]"   # killa-ohm(s), stress on killa (no linking 'r')
HOOK = "Memory hook: |"             # pause after 'Memory hook:'

# ── Units: (singular, plural). Before a noun the singular is used ("a 3 amp fuse"), items 1-3, 8, 10, 20.
UNITS = {
    "W": ("watt", "watts"), "kW": ("kilowatt", "kilowatts"), "mW": ("milli-watt", "milli-watts"),
    "V": ("volts", "volts"),  # 2: Andy kept "volts" even before a noun ("230 volts mains-supply")
    "kV": ("kilovolts", "kilovolts"), "mV": ("milli-volts", "milli-volts"),
    "A": ("amp", "amps"), "mA": ("milli-amp", "milli-amps"), "µA": ("micro-amp", "micro-amps"),
    "Ah": ("amp hour", "amp hours"),
    "Ω": ("ohm", "ohms"), "kΩ": (KOHM, KOHMS), "MΩ": ("megohm", "megohms"),
    "F": ("farad", "farads"), "µF": ("micro-farad", "micro-farads"), "nF": ("nano-farad", "nano-farads"),
    "pF": ("pico-farad", "pico-farads"),
    "H": ("henry", "henries"), "mH": ("milli-henry", "milli-henries"), "µH": ("micro-henry", "micro-henries"),
    "Hz": ("hertz", "hertz"), "kHz": (KHZ, KHZ), "MHz": ("megahertz", "megahertz"), "GHz": ("giga-hertz", "giga-hertz"),
    "dB": ("dee bee", "dee bee"), "dBW": ("dee bee watts", "dee bee watts"),
    "dBi": ("dee bee eye", "dee bee eye"), "dBd": (DBD, DBD),
    "km": (KM, KM), "m": ("metre", "metres"), "cm": ("centimetre", "centimetres"), "mm": ("millimetre", "millimetres"),
    "s": ("second", "seconds"), "ms": ("milli-second", "milli-seconds"), "µs": ("micro-second", "micro-seconds"),
}
UNIT_RE = "|".join(sorted((re.escape(u) for u in UNITS), key=len, reverse=True))
# Nouns after which a unit is adjectival and singular ("a 3 amp fuse", "a 10 metre wavelength").
NOUNS = set("""fuse plug resistor resistors capacitor capacitors inductor inductors appliance device kettle
    signal signals segment transmitter transmitters supply limit band bands wavelength coax co-ax impedance
    tone hum battery dipole antenna voice calling channel feeder""".split())

# ── Whole-word abbreviations (review items 39-117) ──
ABBR = {
    "RF": "ah F", "CW": "see double you", "SSB": "ess ess bee", "PSK": "pea, ess, kay",
    "EMC": "[[ ˈiː ɛm sˌiː ]]", "EMF": "[[ ˈiː ɛm ˌɛf ]]", "RMS": "[[ ˈɑː ɛm ˌɛs ]]",
    "PEP": "pea-ee-pea", "ERP": "ee-are-pea", "EIRP": "ee-eye-are-pea", "DAB": "D, A, B,",
    "USB": "U S B,", "LSB": "L S B,", "FFT": "F F tea", "DDS": "{D D S,}", "DAC": "dee eh sea",
    "APRS": "eh P R S", "CQ": "seek you", "ISM": "eye-ess-em", "R1": "arr-1", "R2": "arr-2",
    "RSGB": "R S G B", "IARU": "eye eh R U", "ITU": "eye T U", "CEPT": "C E pea T",
    "ICNIRP": "eye C N eye R pea", "UK": "U K", "USA": "U S eh", "MM": "M M",
    "Ic": "collector current", "Ib": "base current", "Ie": "emitter current", "CIO": "C eye O",
    "Vrms": "[[ ˈɑː ɛm ˌɛs ]] voltage", "Vpeak": "peak voltage", "Rc": "the collector resistor",
}
FIRST_THEN = {"MUF": ("M U F, or muff,", "muff"), "LUF": ("L U F, or luff,", "luff")}  # 60-61
COUNT_WORDS = "One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|two|three|four|five|six"
DIGIT_WORDS = "zero one two three four five six seven eight nine".split()


def _num_words_decimal(n):
    """0.003 -> 'oh point double-oh 3' (item 4); 0.5 -> 'oh point 5'."""
    whole, frac = n.split(".")
    out, i = [], 0
    while i < len(frac):
        if frac[i] == "0" and frac[i + 1:i + 2] == "0":
            out.append("double-oh"); i += 2
        else:
            out.append("oh" if frac[i] == "0" else frac[i]); i += 1
    return ("oh" if whole == "0" else whole) + " point " + " ".join(out)


def _number(n):
    """Spoken form of a number, before any unit."""
    n = n.replace(",", "") if re.fullmatch(r"\d{1,3}(,\d{3})+", n) else n
    if "." in n:
        whole, frac = n.split(".", 1)
        frac = frac.rstrip("0")                      # 14: drop trailing zeros (2.000 -> 2)
        if not frac:
            return whole
        if whole == "0":
            return _num_words_decimal(f"0.{frac}")   # 4
        if len(whole) == 3:                          # 82: 144.8 -> one four four point eight
            return " ".join(DIGIT_WORDS[int(d)] for d in whole) + " point " + " ".join(DIGIT_WORDS[int(d)] for d in frac)
        return f"{whole}.{frac}"
    return n


def _units(t):
    def rep(m):
        num, unit, nxt = m.group(1), m.group(2), m.group(3) or ""
        sing, plur = UNITS[unit]
        word = nxt.strip(" ").lower()
        attributive = word in NOUNS or (unit == "m" and word == "fm")
        one = num in ("1", "1.0")
        spoken = sing if (one or attributive) else plur
        return f"{_number(num)} {spoken}{nxt}"
    # number, optional space, unit, then the next word (kept) to decide singular/plural
    return re.sub(rf"(?<![\w.])(\d+(?:[.,]\d+)*)\s?({UNIT_RE})(?![\w])(\s+[A-Za-z][\w-]*)?", rep, t)


def _new_statement(segment):
    """True when the text between two '=' signs starts a fresh statement, not a chain:
    'R1 = 200 Ω and R2 = 600 Ω', 'E = 2k, F = 4k', '... = 800 Ω, so V = ...'."""
    return bool(re.search(r"\b(and|so|or|then)\b|[;:]|,\s*(?:[A-Z]\w{0,2}|[a-z])\s*$", segment))


def _equals(sentence):
    """Items 4/9/24/33: 'A = B = C' -> 'A, equals B, which equals C'."""
    parts = sentence.split("=")
    if len(parts) == 1:
        return sentence
    out = parts[0].rstrip()
    for i, p in enumerate(parts[1:]):
        prev = parts[i]
        starting = i == 0 or _new_statement(prev)
        left_empty = not out.strip() or out.rstrip().endswith(("(",)) or (i == 0 and out.rstrip().endswith(","))
        # words in the term on the left, back to the last clause break
        term = re.split(r"[,;:(]|\bso\b|\band\b", out)[-1]
        if starting and not left_empty and len(term.split()) > 4:
            out = out.rstrip(" ,") + ", which is "        # 33: 'a quarter wavelength, which is 90 degrees'
        elif starting and not left_empty:
            out = out.rstrip(" ,") + ", equals "          # 4: short pause after the first term
        else:
            out = out.rstrip(" ,") + ", which equals "
        out += p.lstrip()
    return out


def _arrows(sentence):
    """Item 27: one arrow -> 'so', a chain -> 'then' with a longer pause after the first item."""
    n = sentence.count("→")
    if n == 1:
        return re.sub(r"\s*→\s*", ", so ", sentence)
    if n > 1:
        first = True
        def rep(_):
            nonlocal first
            s = ", | then " if first else ", then "
            first = False
            return s
        return re.sub(r"\s*→\s*", rep, sentence)
    return sentence


def _callsign(m):
    """Items 105-114: letter by letter; a lone A becomes 'eh' so it isn't read as the word 'a'."""
    return " ".join("eh" if ch == "A" else ch for ch in m.group(0))


PREFIX_SAY = {"EI": "E eye", "F": "F", "I": "eye", "JA": "J eh", "PA": "P eh", "VE": "vee ee", "VK": "V K",
              "W": "double you", "ZL": "Z L", "G": "G", "GM": "G M", "GW": "G W"}
COUNTRIES = "Ireland|France|Italy|Japan|Netherlands|Canada|Australia|USA|New Zealand|Scotland|Wales|England"


def _prefixes(t):
    """Items 109-113: country prefixes, 'V K, Australia' (one flowing sentence, commas only)."""
    keys = "|".join(sorted(PREFIX_SAY, key=len, reverse=True))
    t = re.sub(rf"\b({keys})(?: is)? (?=(?:{COUNTRIES})\b)", lambda m: PREFIX_SAY[m.group(1)] + ", " + ("is " if " is" in m.group(0) else ""), t)
    t = re.sub(rf"\bprefix ({keys})\b", lambda m: "prefix " + PREFIX_SAY[m.group(1)], t)
    t = re.sub(rf"^\s*({keys}):", lambda m: " " + PREFIX_SAY[m.group(1)] + ":", t)
    t = re.sub(r"^\s*W \(also K, N, AA–AL\)", " double you, also K, N, eh eh to, eh L,", t)
    if t.strip() in PREFIX_SAY and t.strip() not in ("F", "G"):
        t = " " + PREFIX_SAY[t.strip()] + " "
    return t


def spoken(text):
    t = " " + str(text).strip() + " "
    t = _prefixes(t)

    # Phrase-level fixes agreed in the review
    t = t.replace("e.g.", "for example,").replace("i.e.", "that is,")              # 32
    t = re.sub(r"\bf\(MHz\)", "the frequency in megahertz", t)                    # 31
    t = re.sub(r"\bspectrum display", "spectrum-display", t)                      # 63
    t = re.sub(r"\brecord a QSO\b", f"{RECORD} a QSO", t)                         # 46
    t = re.sub(r"\bcoax\b", "co-ax", t)                                            # 117
    t = re.sub(r"\bE[- ]layer\b", "ee-layer", t)                                   # 19
    t = re.sub(r"\b2m and 70cm\b", "2 metre and 70 centimetre bands", t)           # 21
    t = re.sub(r"\bERP rather than PEP\b", f"ERP, ^ {RATHER} than PEP", t)         # 68
    t = re.sub(r"(\d\s?V) mains\b", r"\1 mains-supply", t)                        # 2
    t = re.sub(rf"\b({COUNT_WORDS}) (?=\d)", r"\1, ", t)                           # 8: 'Two, 10 micro-farad'
    t = re.sub(r"^\s*(\d+) followed by", r" \1, followed by", t)                  # 9
    t = re.sub(r"\bV/I\b", "V over I", t)
    t = re.sub(r"\bwith β = (\d+)", r"with a beta of \1", t)
    t = re.sub(r"Greek letter µ", "Greek letter mu", t)
    t = re.sub(r"\b[Kk]ilometres\b", KM, t)                                          # 19: stress on killa
    t = re.sub(r"\b[Kk]ilohertz\b", KHZ, t)
    t = re.sub(r"\b[Kk]ilohms\b", KOHMS, t)
    t = re.sub(r"\b[Kk]ilohm\b", KOHM, t)                                          # 12
    t = re.sub(r"\bUSB above \(60 m is the exception, using USB\)", "USB above 60 m is the exception, using USB", t)  # 72
    t = re.sub(r"(\d) APRS\b", r"\1, ^ APRS", t)                                     # 82
    t = re.sub(r"\bPA is the prefix\b", "P eh is the prefix", t)
    t = re.sub(r"→ \((\w+)\) →", r"→ \1 →", t)                                       # 'oscillator → (buffer) →'
    t = re.sub(r"\b78xx\b", "78 X X", t)
    t = re.sub(r"\bTotal R\b", "Total resistance", t)
    t = re.sub(r"(?<=so )V(?= =)", "volts", t)                                          # 4
    t = re.sub(r"(?:(?<=^ )|(?<=\. ))R(?= =)", "Resistance", t)
    t = re.sub(r"\s+/\s+", " or ", t)                                                 # 'open-wire / ladder line'
    t = re.sub(r"\s*−\s*(?=\d)", lambda m: " minus " if m.group(0).strip() != m.group(0) else "minus ", t)
    t = re.sub(r"\bPL259\b", "P L 2 5 9", t)
    t = re.sub(r"\bSO239\b", "S O 2 3 9", t)                                      # 117
    t = re.sub(r"(?<=[A-Za-z0-9 ])/(?=[A-Za-z0-9])", " and ", t)                   # 29

    # Ranges: '430–432' -> '430 to, 432' (14, 15, 28)
    t = re.sub(r"(\d[\d.,]*)\s?[–-]\s?(\d)", r"\1 to, \2", t)

    # Numbers with units, then any numbers left over that need special reading
    t = _units(t)
    t = re.sub(r"(?<![\w.])(\d+\.\d+)(?![\w.]*\d)", lambda m: _number(m.group(1)), t)

    # Unit words standing alone ('reference for dBi', 'ms ↔ kHz')
    for u, word in (("dBW", "dee bee watts"), ("dBi", "dee bee eye"), ("dBd", DBD), ("dB", "dee bee"),
                    ("kHz", KHZ), ("MHz", "megahertz"), ("GHz", "giga-hertz"), ("µs", "micro-seconds"),
                    ("ms", "milli-seconds")):
        t = re.sub(rf"(?<![\w]){re.escape(u)}(?![\w])", word, t)

    # Symbols
    t = t.replace("±", "plus or minus ").replace("%", " percent").replace("°", " degrees")   # 30, 32, 33
    t = re.sub(r"~\s*", "about ", t)                                                          # 34
    t = re.sub(r"\s*≈\s*", ", which is about ", t)                                            # 31
    t = re.sub(r"\s*×\s*(?=\d)", " times ", t).replace("×", " times")                         # 25
    t = t.replace("÷", " divided by ")                                                        # 26
    t = re.sub(r"(\b[\w-]+s)\s*↔\s*", r"\1 pair with ", t)                                    # 115 plural
    t = re.sub(r"\s*↔\s*", " pairs with ", t)
    t = re.sub(r"λ", "Lambda, the wavelength", t)                                            # 36
    t = t.replace("β", "beta").replace("µ", "micro").replace("Ω", " ohms")
    t = re.sub(r"\s+\+\s+|(?<![\w])\+(?=\d)", " plus ", t)                                         # 35

    t = re.sub(r"[ ]{2,}", " ", t)

    # Brackets: read with short pauses either side (38)
    t = re.sub(r"\s*\(\s*([^()]*?)\s*\)\s*([.,;:!?]?)", lambda m: f", {m.group(1)}{m.group(2) or ','} ", t)

    # Formula letters (4): only where a single capital stands in a formula
    t = re.sub(r"(?:(?<=^ )|(?<=[\s(]))I(?=\s*(?:=|,\s*equals))", "Eye", t)
    t = re.sub(r"(?<=divided by )R\b", "resistance", t)

    # Sentence by sentence: equals chains and arrows
    t = " ".join(_arrows(_equals(s)) for s in re.split(r"(?<=[.!?])\s+", t.strip()))

    t = re.sub(r"equals V divided by (?:R\b|resistance)", "equals volts divided by resistance", t)       # 4

    # Q codes (39-48): spaced letters with a short pause after the group
    t = re.sub(r"\bQ([A-Z])([A-Z])\b(,?)", lambda m: f"Q {m.group(1)} {m.group(2)}" + ("," if not t[m.end():m.end() + 2].strip().startswith((",", ".", "?")) else ""), t)

    # Callsigns (105-114): letter by letter
    t = re.sub(r"\b(?:[2MG][A-Z]?\d[A-Z]{1,3}|[A-Z]{1,2}\d[A-Z]{2,3})\b", _callsign, t)

    # MUF / LUF: both forms the first time, then the word (60-61)
    for ab, (first, later) in FIRST_THEN.items():
        t = re.sub(rf"\b{ab}\b", first, t, count=1)
        t = re.sub(rf"\b{ab}\b", later, t)

    # Abbreviations
    for ab, say in ABBR.items():
        t = re.sub(rf"(?<![\w-]){re.escape(ab)}(?![\w])", say, t)

    # Tidy punctuation
    t = re.sub(r"\s+([,.;:!?])", r"\1", t)
    t = re.sub(r",\s*,", ",", t)
    t = re.sub(r",\s*([.;:!?])", r"\1", t)
    t = re.sub(r"([.;:!?]),", r"\1", t)
    t = re.sub(r"\s{2,}", " ", t).strip()
    t = re.sub(r"^,\s*", "", t)
    return t


def hook(text):
    return f"{HOOK} {spoken(text)}"


def stem(text):
    """A question stem, ending with one full stop or question mark."""
    t = spoken(text).rstrip()
    return t if t.endswith(("?", ".", "!")) else t + "."


def option(letter, text):
    """Every option starts 'Option A, ^' (item 13 / PSK test)."""
    body = spoken(text).rstrip(".")
    # A one- or two-word answer ("V K") garbles after a fixed pause, so it gets a comma instead.
    pause = ", ^" if len(re.sub(r"\[\[.*?\]\]", "x", body).split()) > 2 else ","
    return f"Option {letter}{pause} {body}."
