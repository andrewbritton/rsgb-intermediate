// Intermediate Schedule 1 (from the public EX308 reference booklet) for "find it in the booklet" drills.
// [band label, low MHz, high MHz, status, power, note]
window.SCHEDULE = [
  ["135.7–137.8 kHz", 0.1357, 0.1378, "Secondary", "1 W ERP", ""],
  ["1810–1830 kHz", 1.81, 1.83, "Primary", "100 W", "non-interference outside UK"],
  ["1830–1850 kHz", 1.83, 1.85, "Primary", "100 W", ""],
  ["1850–2000 kHz", 1.85, 2.0, "Secondary", "32 W", ""],
  ["3500–3800 kHz", 3.5, 3.8, "Primary (shared)", "100 W", ""],
  ["7000–7200 kHz", 7.0, 7.2, "Primary", "100 W", ""],
  ["10100–10150 kHz", 10.1, 10.15, "Secondary", "100 W", ""],
  ["14000–14350 kHz", 14.0, 14.35, "Primary", "100 W", ""],
  ["18068–18168 kHz", 18.068, 18.168, "Primary", "100 W", ""],
  ["21000–21450 kHz", 21.0, 21.45, "Primary", "100 W", ""],
  ["24890–24990 kHz", 24.89, 24.99, "Primary", "100 W", ""],
  ["28.0–29.7 MHz", 28.0, 29.7, "Primary", "100 W", ""],
  ["50–51 MHz", 50, 51, "Primary", "100 W", "non-interference outside UK"],
  ["51–52 MHz", 51, 52, "Secondary", "100 W", ""],
  ["70.0–70.5 MHz", 70, 70.5, "Secondary", "100 W", ""],
  ["144–146 MHz", 144, 146, "Primary", "100 W", ""],
  ["430–431 MHz", 430, 431, "Secondary", "40 W ERP", ""],
  ["431–432 MHz", 431, 432, "Secondary", "40 W ERP", "not within 100 km of Charing Cross"],
  ["432–440 MHz", 432, 440, "Secondary", "100 W", ""],
  ["1240–1325 MHz", 1240, 1325, "Secondary", "100 W", ""],
  ["2310–2350 MHz", 2310, 2350, "Secondary", "100 W", ""],
  ["2400–2450 MHz", 2400, 2450, "Secondary", "100 W", "must accept interference from ISM users"],
  ["5755–5850 MHz", 5755, 5850, "Secondary", "100 W", "must accept interference from ISM users"],
  ["24.00–24.05 GHz", 24000, 24050, "Primary", "100 W", "must accept interference from ISM users"]
];

(function () {
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const S = window.SCHEDULE;
  const fmt = mhz => mhz < 1 ? +(mhz * 1000).toFixed(1) + " kHz" : mhz >= 1000 ? +(mhz / 1000).toFixed(3) + " GHz" : +mhz.toFixed(3) + " MHz";
  const inBand = row => { const f = row[1] + (row[2] - row[1]) * (0.2 + Math.random() * 0.6); return Math.round(f * 1000) / 1000; };
  const shuffleFill = (correct, pool) => { const out = [correct]; for (const p of pool.sort(() => Math.random() - .5)) if (!out.includes(p) && out.length < 4) out.push(p); return out; };

  window.EX308_DRILLS = {
    status: () => {
      const row = pick(S), f = inBand(row);
      const isSec = row[3].startsWith("Secondary");
      return { q: `Using EX308: what is the status of the Amateur Service allocation at ${fmt(f)} for an Intermediate?`,
        opts: [isSec ? "Secondary" : "Primary", isSec ? "Primary" : "Secondary", "Not allocated", "Only with Ofcom written consent"],
        x: `${row[0]}: ${row[3]}, ${row[4]}${row[5] ? ", " + row[5] : ""}.`, sec: 1, code: "1H1" };
    },
    power: () => {
      const row = pick(S), f = inBand(row);
      return { q: `Using EX308: what is the maximum power at ${fmt(f)}?`,
        opts: shuffleFill(row[4], ["100 W", "32 W", "40 W ERP", "1 W ERP", "50 W", "10 W"]),
        x: `${row[0]}: ${row[4]}.`, sec: 1, code: "1H1" };
    },
    ism: () => {
      const ism = S.filter(r => r[5].includes("ISM")), not = S.filter(r => !r[5].includes("ISM"));
      const yes = pick(ism), f = fmt(inBand(yes));
      return { q: "Using EX308: on which frequency must you accept interference from ISM users?",
        opts: shuffleFill(f, not.map(r => fmt(inBand(r)))),
        x: `${yes[0]} has the ISM condition. The other ISM bands are 2400–2450 MHz, 5755–5850 MHz and 24.00–24.05 GHz.`, sec: 1, code: "1H1" };
    }
  };
})();
