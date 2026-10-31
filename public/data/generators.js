// Calculation generators: every call makes a fresh question with new numbers.
// Each returns { q, opts:[correct, wrong, wrong, wrong], x, sec, code }
(function () {
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const r = (n, d = 3) => +Number(n).toPrecision(d);
  const uniq = (correct, wrongs) => {
    const out = [correct];
    for (const w of wrongs) if (!out.includes(w) && out.length < 4) out.push(w);
    // fallback: plausible near-miss numbers with the same unit
    const m = String(correct).match(/^(-?[\d.]+)(.*)$/);
    const factors = [2, 0.5, 1.5, 0.75, 3, 1.1, 0.9, 1.25, 0.8, 4];
    for (const f of factors) {
      if (out.length >= 4) break;
      const base = m && +m[1] !== 0 ? +m[1] : null;
      const cand = base != null ? +(base * f).toPrecision(3) + m[2] : m ? Math.round((f - 1) * 20) + m[2] : correct + " ×" + f;
      if (!out.includes(cand) && cand !== correct) out.push(cand);
    }
    return out;
  };
  const fmtR = ohms => ohms >= 1e6 ? r(ohms / 1e6) + " MΩ" : ohms >= 1000 ? r(ohms / 1000) + " kΩ" : r(ohms) + " Ω";
  const fmtI = a => a >= 1 ? r(a) + " A" : a >= 1e-3 ? r(a * 1000) + " mA" : r(a * 1e6) + " µA";
  const fmtF = hz => hz >= 1e6 ? r(hz / 1e6) + " MHz" : hz >= 1e3 ? r(hz / 1e3) + " kHz" : r(hz) + " Hz";
  const fmtT = s => s >= 1 ? r(s) + " s" : s >= 1e-3 ? r(s * 1e3) + " ms" : s >= 1e-6 ? r(s * 1e6) + " µs" : r(s * 1e9) + " ns";
  const E12 = [1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

  const G = {
    ohmsI: { name: "Ohm's law: current", sec: 2, code: "2C1", make() {
      const V = pick([5, 6, 9, 12, 13.8, 24]), R = pick(E12) * pick([100, 1000]);
      const I = V / R;
      return { q: `What current flows when ${V} V is applied across ${fmtR(R)}?`,
        opts: uniq(fmtI(I), [fmtI(I * 10), fmtI(I / 10), fmtI(V * R / 1e6)]),
        x: `I = V ÷ R = ${V} ÷ ${R} = ${fmtI(I)}. Cover I in the triangle: V over R.` };
    }},
    ohmsV: { name: "Ohm's law: voltage", sec: 2, code: "2C1", make() {
      const I = pick([2, 5, 10, 20, 50]) / 1000, R = pick([100, 220, 470, 1000, 2200]);
      const V = I * R;
      return { q: `${fmtI(I)} flows through ${fmtR(R)}. What is the voltage across it?`,
        opts: uniq(r(V) + " V", [r(V * 10) + " V", r(V / 10) + " V", r(R / (I * 1000)) + " V"]),
        x: `V = I × R = ${I} A × ${R} Ω = ${r(V)} V. Remember to turn mA into A (÷ 1000) first.` };
    }},
    series: { name: "Resistors in series", sec: 2, code: "2C1", make() {
      const a = pick(E12) * 1000, b = pick(E12) * 1000, c = pick(E12) * 1000;
      const t = a + b + c, p = 1 / (1 / a + 1 / b + 1 / c);
      return { q: `What is the total resistance of ${fmtR(a)}, ${fmtR(b)} and ${fmtR(c)} in series?`,
        opts: uniq(fmtR(t), [fmtR(p), fmtR(t / 3), fmtR(t * 10)]),
        x: `Series resistors simply add: ${fmtR(a)} + ${fmtR(b)} + ${fmtR(c)} = ${fmtR(t)}.` };
    }},
    parallel2: { name: "Two resistors in parallel", sec: 2, code: "2C1", make() {
      const a = pick(E12) * 1000, b = pick(E12) * 1000;
      const p = a * b / (a + b);
      return { q: `What is the combined resistance of ${fmtR(a)} and ${fmtR(b)} in parallel?`,
        opts: uniq(fmtR(p), [fmtR(a + b), fmtR((a + b) / 2), fmtR(Math.abs(a - b) || a * 2)]),
        x: `Product over sum: (${a} × ${b}) ÷ (${a} + ${b}) = ${fmtR(p)}. Check: it must be less than ${fmtR(Math.min(a, b))}.` };
    }},
    parallel3: { name: "Three resistors in parallel", sec: 2, code: "2C1", make() {
      const v = [pick(E12) * 1000, pick(E12) * 1000, pick(E12) * 1000];
      const p = 1 / v.reduce((s, x) => s + 1 / x, 0);
      return { q: `What is the combined resistance of ${v.map(fmtR).join(", ")} in parallel?`,
        opts: uniq(fmtR(p), [fmtR(v[0] + v[1] + v[2]), fmtR((v[0] + v[1] + v[2]) / 3), fmtR(Math.max(...v))]),
        x: `1/R = 1/${v[0]} + 1/${v[1]} + 1/${v[2]}, giving R = ${fmtR(p)}. On a phone calculator: 1÷${v[0]} + 1÷${v[1]} + 1÷${v[2]}, then 1÷ the answer. Must be less than the smallest.` };
    }},
    divider: { name: "Potential divider", sec: 2, code: "2C2", make() {
      const V = pick([9, 10, 12, 15, 24]), r1 = pick([1, 2, 3, 4]) * 1000, r2 = pick([1, 2, 3, 4, 5]) * 1000;
      const out = V * r2 / (r1 + r2);
      return { q: `A ${V} V supply feeds R1 = ${fmtR(r1)} (top) and R2 = ${fmtR(r2)} (bottom) in series. What is the voltage across R2?`,
        opts: uniq(r(out) + " V", [r(V * r1 / (r1 + r2)) + " V", r(V / 2) + " V", r(V * r2 / r1) + " V"]),
        x: `Vout = V × R2 ÷ (R1 + R2) = ${V} × ${r2} ÷ ${r1 + r2} = ${r(out)} V. The bigger resistor takes the bigger share.` };
    }},
    internalR: { name: "Battery internal resistance", sec: 2, code: "2C3", make() {
      const emf = pick([12.6, 13.2, 13.4, 13.8]), Rint = pick([0.1, 0.2, 0.25, 0.5]);
      const I1 = pick([1, 2]), I2 = I1 + pick([2, 4, 5]);
      const v1 = r(emf - I1 * Rint), v2 = r(emf - I2 * Rint);
      return { q: `A supply gives ${v1} V at ${I1} A and ${v2} V at ${I2} A. What is its open-circuit voltage (EMF)?`,
        opts: uniq(r(emf) + " V", [v1 + " V", r(emf + Rint) + " V", r(emf - Rint * 2) + " V", v2 + " V", r(emf + 2 * Rint) + " V", r(v1 + 2 * (v1 - v2)) + " V"]),
        x: `Drop = ${r(v1 - v2)} V for ${I2 - I1} A extra, so internal R = ${Rint} Ω. At ${I1} A it loses ${r(I1 * Rint)} V, so EMF = ${v1} + ${r(I1 * Rint)} = ${emf} V.` };
    }},
    power: { name: "Power P = V × I", sec: 2, code: "2B1", make() {
      const V = pick([12, 13.8, 24, 50]), I = pick([0.5, 2, 2.5, 4, 10]);
      return { q: `A circuit draws ${I} A from ${V} V. What power does it use?`,
        opts: uniq(r(V * I) + " W", [r(V / I) + " W", r(V + I) + " W", r(V * I * 2) + " W"]),
        x: `P = V × I = ${V} × ${I} = ${r(V * I)} W.` };
    }},
    fuse: { name: "Mains fuse rating", sec: 8, code: "8A4", make() {
      const P = pick([230, 460, 690, 920, 1150, 2300]);
      const I = P / 230, fuses = [3, 5, 13];
      const f = fuses.find(x => x > I) || 13;
      return { q: `An appliance rated ${P} W runs from 230 V mains. What current does it draw?`,
        opts: uniq(r(I) + " A", [r(I * 10) + " A", r(I / 10) + " A", r(P / 120) + " A"]),
        x: `I = P ÷ V = ${P} ÷ 230 = ${r(I)} A. Fit the next fuse above: ${f} A.` };
    }},
    capPar: { name: "Capacitors in series & parallel", sec: 2, code: "2D2", make() {
      const a = pick([2, 4, 6, 10, 22, 47]), b = pick([2, 4, 10, 22, 47]);
      const par = a + b, ser = r(a * b / (a + b));
      return pick([
        { q: `${a} µF and ${b} µF capacitors are connected in parallel. Total capacitance?`,
          opts: uniq(par + " µF", [ser + " µF", r(a * b) + " µF", r(par / 2) + " µF"]),
          x: `Capacitors in parallel ADD: ${a} + ${b} = ${par} µF. They're the opposite of resistors.` },
        { q: `${a} µF and ${b} µF capacitors are connected in series. Total capacitance?`,
          opts: uniq(ser + " µF", [par + " µF", r(a * b) + " µF", r(par / 2) + " µF"]),
          x: `Capacitors in series use product over sum: (${a} × ${b}) ÷ (${a} + ${b}) = ${ser} µF. Less than the smallest.` }
      ]);
    }},
    indSer: { name: "Inductors in series & parallel", sec: 2, code: "2D5", make() {
      const a = pick([2, 4, 6, 10, 12]), n = pick([2, 3]);
      return pick([
        { q: `${n} inductors of ${a} mH each are connected in series (no coupling). Total inductance?`,
          opts: uniq(a * n + " mH", [r(a / n) + " mH", a + " mH", a * n * 2 + " mH"]),
          x: `Inductors behave like resistors: series adds. ${n} × ${a} = ${a * n} mH.` },
        { q: `${n} inductors of ${a} mH each are connected in parallel (no coupling). Total inductance?`,
          opts: uniq(r(a / n) + " mH", [a * n + " mH", a + " mH", r(a / (n * 2)) + " mH"]),
          x: `Like resistors: ${n} equal in parallel = one ÷ ${n} = ${r(a / n)} mH.` }
      ]);
    }},
    period: { name: "Frequency and period", sec: 2, code: "2E2", make() {
      const f = pick([50, 100, 200, 400, 500, 1000, 2000, 5000, 1e4, 1e5, 1e6, 2e6]);
      const T = 1 / f;
      return pick([
        { q: `What is the period of a ${fmtF(f)} signal?`,
          opts: uniq(fmtT(T), [fmtT(T * 10), fmtT(T / 10), fmtT(T * 1000)]),
          x: `T = 1 ÷ f = 1 ÷ ${f} = ${fmtT(T)}. Pairs: kHz ↔ ms, MHz ↔ µs.` },
        { q: `A signal has a period of ${fmtT(T)}. What is its frequency?`,
          opts: uniq(fmtF(f), [fmtF(f * 10), fmtF(f / 10), fmtF(f * 1000)]),
          x: `f = 1 ÷ T = ${fmtF(f)}.` }
      ]);
    }},
    rms: { name: "RMS and peak", sec: 2, code: "2E3", make() {
      const Vp = pick([10, 14, 20, 50, 100, 141, 325]);
      return { q: `A sine wave has a peak voltage of ${Vp} V. What is its RMS voltage?`,
        opts: uniq(r(Vp * 0.707) + " V", [r(Vp * 1.414) + " V", r(Vp / 2) + " V", Vp + " V"]),
        x: `Vrms = 0.707 × Vpeak = 0.707 × ${Vp} = ${r(Vp * 0.707)} V. (Peak-to-peak would be ${Vp * 2} V.)` };
    }},
    wavelength: { name: "Frequency ↔ wavelength", sec: 2, code: "2E7", make() {
      const bands = [[1.9, 160], [3.6, 80], [7.1, 40], [10.1, 30], [14.2, 20], [18.1, 16], [21.2, 14], [28.5, 10], [50, 6], [70, 4], [145, 2], [433, 0.7]];
      const [f] = pick(bands); const l = 300 / f;
      return pick([
        { q: `What is the wavelength of a ${f} MHz signal?`,
          opts: uniq(r(l, 2) + " m", [r(l * 2, 2) + " m", r(l / 2, 2) + " m", r(l * 4, 2) + " m"]),
          x: `λ (m) = 300 ÷ f (MHz) = 300 ÷ ${f} ≈ ${r(l, 2)} m.` },
        { q: `A half-wave dipole for ${f} MHz is about how long?`,
          opts: uniq(r(l / 2, 2) + " m", [r(l, 2) + " m", r(l / 4, 2) + " m", r(l * 2, 2) + " m"]),
          x: `Wavelength = 300 ÷ ${f} = ${r(l, 2)} m. Half of that = ${r(l / 2, 2)} m.` }
      ]);
    }},
    turns: { name: "Transformer turns ratio", sec: 2, code: "2G1", make() {
      const Np = pick([500, 1000, 2000, 2300]), Ns = pick([50, 60, 100, 120, 230]);
      const Vp = 230, Vs = Vp * Ns / Np;
      return { q: `A transformer has ${Np} primary turns and ${Ns} secondary turns. With ${Vp} V in, what is the output?`,
        opts: uniq(r(Vs) + " V", [r(Vp * Np / Ns) + " V", r(Vs * 2) + " V", r(Vs / 2) + " V"]),
        x: `Vs = Vp × Ns ÷ Np = ${Vp} × ${Ns} ÷ ${Np} = ${r(Vs)} V. ${Ns < Np ? "Fewer secondary turns: step down." : "More secondary turns: step up."}` };
    }},
    beta: { name: "Transistor gain and collector R", sec: 2, code: "2I4", make() {
      const b = pick([50, 100, 150, 200]), Ib = pick([10, 20, 40]) * 1e-6, Vcc = pick([9, 12]);
      const Ic = b * Ib, Rc = (Vcc / 2) / Ic;
      return pick([
        { q: `A transistor has β = ${b} and base current ${fmtI(Ib)}. What is the collector current?`,
          opts: uniq(fmtI(Ic), [fmtI(Ib / b), fmtI(Ic * 10), fmtI(Ic / 10)]),
          x: `Ic = β × Ib = ${b} × ${fmtI(Ib)} = ${fmtI(Ic)}.` },
        { q: `Common emitter amp on ${Vcc} V: β = ${b}, Ib = ${fmtI(Ib)}. Which collector resistor puts the collector at half supply?`,
          opts: uniq(fmtR(Rc), [fmtR(Rc * 2), fmtR(Rc / 2), fmtR(Vcc / Ib)]),
          x: `Ic = ${b} × ${fmtI(Ib)} = ${fmtI(Ic)}. Half supply (${Vcc / 2} V) is across Rc, so Rc = ${Vcc / 2} ÷ ${r(Ic)} = ${fmtR(Rc)}.` }
      ]);
    }},
    efficiency: { name: "PA efficiency", sec: 3, code: "3F1", make() {
      const Pin = pick([50, 100, 150, 200]), e = pick([50, 60, 70, 75]);
      return { q: `A power amplifier takes ${Pin} W of DC and is ${e}% efficient. What is the RF output?`,
        opts: uniq(r(Pin * e / 100) + " W", [r(Pin * (100 - e) / 100) + " W", Pin + " W", r(Pin * 100 / e) + " W"]),
        x: `RF out = ${Pin} × ${e}% = ${r(Pin * e / 100)} W. The rest (${r(Pin * (100 - e) / 100)} W) becomes heat.` };
    }},
    dbRatio: { name: "Decibels: power ratios", sec: 9, code: "9B1", make() {
      const table = [[3, 2], [6, 4], [9, 8], [10, 10], [13, 20], [16, 40], [20, 100], [23, 200], [30, 1000]];
      const [db, x] = pick(table);
      return { q: `A gain of ${db} dB is a power multiplication of`,
        opts: uniq(x + "×", [db + "×", x * 2 + "×", r(x / 2) + "×"]),
        x: `Build it from 3s and 10s: every 3 dB doubles, every 10 dB ×10. ${db} dB = ×${x}.` };
    }},
    dbW: { name: "dBW", sec: 9, code: "9B1", make() {
      const list = [[1, 0], [2, 3], [4, 6], [8, 9], [10, 10], [20, 13], [25, 14], [40, 16], [50, 17], [100, 20], [200, 23], [400, 26], [800, 29], [1000, 30]];
      const [w, d] = pick(list);
      return pick([
        { q: `${w} W expressed in dBW is`, opts: uniq(d + " dBW", [d + 3 + " dBW", Math.max(0, d - 3) + " dBW", w + " dBW"]),
          x: `dBW is relative to 1 W. 10 W = 10 dBW, 100 W = 20 dBW, then each doubling adds 3. ${w} W = ${d} dBW.` },
        { q: `${d} dBW is how many watts?`, opts: uniq(w + " W", [w * 2 + " W", r(w / 2) + " W", d + " W"]),
          x: `${d} dBW = ${w} W. Anchor: 20 dBW = 100 W.` }
      ]);
    }},
    feeder: { name: "Feeder loss", sec: 4, code: "4A2", make() {
      const P = pick([10, 20, 50, 100]), L = pick([3, 6, 10]);
      const ratio = { 3: 2, 6: 4, 10: 10 }[L];
      return { q: `${P} W is fed into a feeder with ${L} dB loss. How much reaches the antenna?`,
        opts: uniq(r(P / ratio) + " W", [r(P * ratio) + " W", r(P - L) + " W", r(P / (ratio * 2)) + " W"]),
        x: `${L} dB loss = ÷${ratio}. ${P} ÷ ${ratio} = ${r(P / ratio)} W.` };
    }},
    erp: { name: "ERP and EIRP", sec: 4, code: "4C3", make() {
      const P = pick([10, 25, 50, 100]), g = pick([3, 6, 10]);
      const m = { 3: 2, 6: 4, 10: 10 }[g];
      return { q: `${P} W reaches an antenna with ${g} dBd gain. What is the ERP?`,
        opts: uniq(P * m + " W", [P + " W", r(P / m) + " W", P * m * 2 + " W"]),
        x: `ERP = power × gain (relative to a dipole). ${g} dB = ×${m}, so ${P} × ${m} = ${P * m} W ERP. EIRP would be 2.15 dB higher.` };
    }},
    bfo: { name: "BFO frequency", sec: 3, code: "3K1", make() {
      const IF = pick([455, 600, 1600, 9000, 10700]), tone = pick([0.7, 1]);
      return { q: `A receiver's IF is ${IF} kHz. For a ${tone * 1000} Hz CW tone, the BFO could be on`,
        opts: uniq(r(IF - tone, 6) + " kHz", [IF + " kHz", r(IF + 10, 6) + " kHz", r(IF / 2, 6) + " kHz"]),
        x: `The BFO sits ${tone} kHz from the IF so the beat note is audible: ${r(IF - tone, 6)} or ${r(IF + tone, 6)} kHz. Exactly on the IF gives zero beat (no tone).` };
    }},
    colour: { name: "Resistor colour code", sec: 9, code: "9C1", make() {
      const cols = ["black", "brown", "red", "orange", "yellow", "green", "blue", "violet", "grey", "white"];
      const e12 = pick([10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82]);
      const d1 = Math.floor(e12 / 10), d2 = e12 % 10, m = Math.floor(Math.random() * 5);
      const val = (d1 * 10 + d2) * 10 ** m;
      return { q: `What is the value of a resistor banded ${cols[d1]}, ${cols[d2]}, ${cols[m]}, gold?`,
        opts: uniq(fmtR(val), [fmtR(val * 10), fmtR(val / 10), fmtR((d2 * 10 + d1) * 10 ** m)]),
        x: `${cols[d1]} = ${d1}, ${cols[d2]} = ${d2}, then ${cols[m]} = ×${10 ** m} → ${fmtR(val)}, ±5% (gold). The code is printed in EX308.` };
    }}
  };
  window.GENERATORS = G;
})();
