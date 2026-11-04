// Syllabus v1.6b sections, with the number of questions each takes in the real 46-question paper
window.SECTIONS = [
  { n: 1, name: "Licensing", short: "Licence", weight: 6, blurb: "Callsigns, supervision, user services, remote control, EMF limits and reading Schedule 1." },
  { n: 2, name: "Technical basics", short: "Technical", weight: 14, blurb: "Resistors, capacitors, inductors, AC, reactance, sampling, transformers, tuned circuits, diodes, transistors and power supplies. The biggest section." },
  { n: 3, name: "Transmitters & receivers", short: "Tx / Rx", weight: 7, blurb: "Modulation, oscillators, SSB and FM generation, key clicks, superhets, detectors, AGC and SDR." },
  { n: 4, name: "Feeders & antennas", short: "Antennas", weight: 4, blurb: "Coax and twin feeder, baluns, dipoles, Yagis, traps, SWR and matching units." },
  { n: 5, name: "Propagation", short: "Propagation", weight: 3, blurb: "Ground wave, sky wave, ionospheric layers, MUF and LUF, sporadic E and multipath." },
  { n: 6, name: "EMC", short: "EMC", weight: 4, blurb: "How interference happens and how to cure it: filters, ferrites, common mode, RF earths." },
  { n: 7, name: "Operating", short: "Operating", weight: 2, blurb: "Q codes, prefixes, band plans, contests, satellites and data modes." },
  { n: 8, name: "Safety", short: "Safety", weight: 3, blurb: "Capacitors, fuses, tools, batteries and working on equipment." },
  { n: 9, name: "Measurement & construction", short: "Measure", weight: 3, blurb: "Meters, decibels, colour codes and soldering." }
];

// RSGB Intermediate Licence Manual (3rd edition) chapters.
// Matched to syllabus codes from the chapter titles. Edit MANUAL_MAP if a topic sits in a different chapter.
window.MANUAL = {
  1: "Licence Conditions", 2: "Operating Techniques", 3: "Tools, Construction & Safe Practice",
  4: "Basic Electronics", 5: "Semiconductors", 6: "RF Oscillators", 7: "Transmitters & Receivers",
  8: "Good Radio Housekeeping", 9: "Harmonics and Spurious Emissions", 10: "Antenna Matching", 11: "Feeders and Baluns",
  12: "Antenna Concepts", 13: "Propagation", 14: "Measurements"
};
// Most specific prefix wins: "3G" beats "3".
window.MANUAL_MAP = {
  "1": 1, "7": 2, "8": 3, "9C": 3, "9D": 3, "9E": 3,
  "2": 4, "2I": 5, "2J": 5, "2I5": 6, "3C": 6,
  "3": 7, "3G": 9, "6D3": 9, "6": 8,
  "4A": 11, "4B": 11, "4H": 11, "4E": 10, "4F": 10, "4C": 12, "4D": 12,
  "5": 13, "9A": 14, "9B": 14
};
window.manualChapter = code => {
  for (let n = code.length; n > 0; n--) { const ch = window.MANUAL_MAP[code.slice(0, n)]; if (ch) return ch; }
  return null;
};
