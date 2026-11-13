// Bite-size lessons that follow the order of the RSGB Intermediate Licence Manual (3rd edition).
// Original text written for the app, keyed to syllabus v1.6b. Each lesson is followed straight away by
// the questions whose syllabus codes are listed in `codes` (plus any calculation generators in `gens`).
// Those cards then join the daily spaced-repetition sessions.
window.LESSONS.push(
  // ── CHAPTER 1: LICENCE CONDITIONS ──
  { id: "c1-1", track: "manual", ch: 1, title: "What your licence is for, and where it works", codes: ["1A1"],
    body: [
      "Your amateur licence exists for one purpose: self-training in radio communication. It is strictly non-commercial. You can't advertise a business on air, and you can't be paid to pass messages.",
      "It covers the United Kingdom, the Channel Islands and the Isle of Man, including their territorial seas.",
      "It also travels with you on UK-registered ships and aircraft. But on a ship flying another country's flag, your UK licence gives you no right to transmit at all, even well out at sea.",
      "The Intermediate licence isn't routinely recognised abroad, so don't assume you can take your radio on holiday and use it."
    ] },
  { id: "c1-2", track: "manual", ch: 1, title: "Callsigns, regional letters and suffixes", codes: ["1A2"],
    body: [
      "New Intermediate licensees are now issued callsigns beginning M8 or M9. Older Intermediate callsigns begin with 2, such as 2E0 or 2E1. Foundation callsigns begin M7.",
      "The regional secondary locator, or RSL, is a letter added after the first character to show where the station is. D is the Isle of Man, E England, I Northern Ireland, J Jersey, M Scotland, U Guernsey and W Wales.",
      "For most callsigns the RSL is now optional. But if you hold a 2-series callsign, using the RSL is still mandatory.",
      "You may add a suffix such as slash P for portable or slash M for mobile. Suffixes are optional, but they must not be offensive and must not make your callsign hard to identify."
    ] },
  { id: "c1-3", track: "manual", ch: 1, title: "Keeping your licence valid", codes: ["1A3"],
    body: [
      "If you change your name or move house, tell Ofcom straight away. Your licence must always show the right details.",
      "At least once every five years you must confirm to Ofcom that your details are still correct. That's called revalidation, and it's done online.",
      "When you get your Intermediate callsign, your Foundation callsign is revoked. You keep one personal callsign at your highest licence level.",
      "Ofcom can revoke a licence for breaking the licence conditions, so these rules matter."
    ] },
  { id: "c1-4", track: "manual", ch: 1, title: "Identifying your station", codes: ["1A4", "1D2"],
    body: [
      "Other stations must always be able to tell who is transmitting. Give your callsign at the start and end of a contact.",
      "You must also identify again whenever something changes: a new frequency, a new mode such as switching from SSB to FM or to data, a new supervisor, or a different regional letter.",
      "Logs: you don't have to log every contact in normal operating, but Ofcom can direct you to keep a log for a period it specifies. Check your manual for any other occasions when a log is compulsory."
    ] },
  { id: "c1-5", track: "manual", ch: 1, title: "Operating with a supervisor", codes: ["1B1"],
    body: [
      "Only you, or someone under your direct supervision, may use your radio equipment.",
      "Now flip it round. When you operate a Full licensee's station beyond your own limits, for example at 400 watts, you're operating under their licence. They must directly supervise you, and you use their callsign, not yours.",
      "The regional letter follows where the station is, not where the licensee comes from. A Welsh Full licensee supervising you in England would sign with the English version of their callsign.",
      "If a friend lets you use their radio unsupervised and you stay within your own licence limits, it simply becomes your station for that time, and you use your own callsign."
    ] },
  { id: "c1-6", track: "manual", ch: 1, title: "Who you can talk to, and secret messages", codes: ["1C1", "1C2"],
    body: [
      "Amateur messages go to other amateur stations only. A group of three or more amateurs talking together is called a net.",
      "You can't make general broadcasts to the public. Calling CQ is fine, because that's an invitation to any amateur to reply.",
      "User services are the emergency responders and local authorities: police, fire, ambulance, coastguard and councils. A member of a user service may use your station to send messages, and you can pass messages on their behalf.",
      "Encryption is banned, with two exceptions: messages sent at the direct request of a user service, and commands used to control an amateur satellite."
    ] },
  { id: "c1-7", track: "manual", ch: 1, title: "Interference, and what Ofcom can do", codes: ["1D1"],
    body: [
      "Your station must not cause undue interference to other radio users. Watch for that word, undue, in exam answers: the rule isn't that you must never cause any interference to anything.",
      "A person authorised by Ofcom can inspect your station. They can require you to modify it, reduce your power, or close it down altogether.",
      "Your neighbour, the police or the council can't order you off the air under the licence. That power belongs to Ofcom."
    ] },
  { id: "c1-8", track: "manual", ch: 1, title: "Remote control and unattended stations", codes: ["1E1"],
    body: [
      "You can operate your station by remote control, but the control link must be secure, so nobody else can take it over. And you must be able to stop transmissions promptly.",
      "If the control link uses amateur frequencies, it must be above 30 megahertz and it must not be encrypted.",
      "Equipment left running unattended somewhere other than your licensed address must have your licence number displayed on it or next to it."
    ] },
  { id: "c1-9", track: "manual", ch: 1, title: "EMF: keeping people safe from RF", codes: ["1G1"],
    body: [
      "Strong radio-frequency fields can heat body tissue, so your licence includes limits based on the ICNIRP guidelines, which protect the general public.",
      "The key numbers: if your station can exceed 10 watts EIRP average, or 100 watts EIRP peak, you need a full EMF assessment and you must keep a record of it.",
      "10 watts EIRP is the same as about 6.1 watts ERP, because a dipole has 2.15 decibels gain over an isotropic source.",
      "Redo the assessment whenever something changes the field: a new antenna, a new location, or more power."
    ] },
  { id: "c1-10", track: "manual", ch: 1, title: "Schedule 1: an open-book question", codes: ["1H1"],
    gens: [], extra: ["x:status", "x:power", "x:ism"],
    body: [
      "Schedule 1 lists every band you can use, its status, your power limit and any special notes. It's printed in the EX308 booklet you have in the exam, so don't memorise it. Practise finding things fast.",
      "Primary means the amateur service has priority. Secondary means you must not interfere with primary users and must accept interference from them. 30 metres, at 10.1 megahertz, is secondary.",
      "Most bands allow 100 watts. Watch for the exceptions in the notes: 1 watt ERP at 136 kilohertz, 32 watts at the top of 160 metres, and 40 watts ERP from 430 to 432 megahertz.",
      "Some bands say you must accept interference from ISM users: industrial, scientific and medical equipment. 2.4 gigahertz, where microwave ovens and Wi-Fi live, is the classic one."
    ] },

  // ── CHAPTER 2: OPERATING TECHNIQUES ──
  { id: "c2-1", track: "manual", ch: 2, title: "Q codes", codes: ["7E1"],
    body: [
      "Q codes are three-letter shortcuts from the days of Morse. The exam expects you to know a handful.",
      "QRM is man-made interference, QRN natural noise. QRO means increase power, QRP low power. QRT means stop sending, and QSY means change frequency.",
      "QSB is fading, QSL a confirmation, QSO a contact, and QTH your location.",
      "Most can be a question too: QTH? means where are you?"
    ] },
  { id: "c2-2", track: "manual", ch: 2, title: "Prefixes and contests", codes: ["7A3", "7A4"],
    body: [
      "The start of a callsign tells you the country. Learn these: EI Ireland, F France, I Italy, JA Japan, PA the Netherlands, VE Canada, VK Australia, W the USA, and ZL New Zealand.",
      "Contests are about making as many contacts as possible in a set time. Each contact needs the correct exchange: usually a signal report plus a serial number or a locator square.",
      "Get the exchange wrong and the contact doesn't count."
    ] },
  { id: "c2-3", track: "manual", ch: 2, title: "Band plans", codes: ["7B1"],
    body: [
      "Band plans divide each band into sections for CW, data, SSB, FM, beacons and so on. They're agreed through the IARU, and the RSGB publishes the UK version.",
      "They aren't licence conditions, but every amateur is expected to follow them.",
      "Below 10 megahertz, voice SSB normally uses lower sideband. Above it, upper sideband. 60 metres is the exception, using upper sideband.",
      "30 metres is CW and data only: no SSB. And there are no contests on 30, 17, 12 or 60 metres.",
      "On 2 metres, the FM calling channel is 145.500 megahertz. Your booklet's band plan pages will confirm details in the exam."
    ] },
  { id: "c2-4", track: "manual", ch: 2, title: "Data modes and satellites", codes: ["7F2", "7G1", "7G2", "7G3", "7G4"],
    body: [
      "A computer sound card can send and receive data modes through your radio. Set the audio level carefully: too much drive distorts the signal and spreads it across neighbouring frequencies. And turn off the computer's system sounds, or you'll transmit them.",
      "Most amateur satellites are in low orbits, so each one is only in view for a few minutes at a time as it passes over.",
      "The uplink and downlink are usually in different bands, for example up on 2 metres and down on 70 centimetres.",
      "The satellite's speed causes Doppler shift, so the frequency drifts during the pass. And use only enough power to hear your own signal coming back down: satellites run on limited solar power."
    ] },

  // ── CHAPTER 3: TOOLS, CONSTRUCTION & SAFE PRACTICE ──
  { id: "c3-1", track: "manual", ch: 3, title: "Electrical safety", codes: ["8A1", "8A4", "8A6", "8A8"], gens: ["fuse"],
    body: [
      "Avoid working on equipment while it's powered. Switch off, unplug, and only work live if there's no alternative and you understand the risk.",
      "Large capacitors in power supplies can hold a dangerous charge after switch-off. A bleed resistor across them drains it away, but always check before touching.",
      "Fuse equipment just above the current it draws. Current equals power divided by 230 volts: a 460 watt device draws 2 amps, so it gets a 3 amp fuse.",
      "A 12 volt car battery can't give you a fatal shock, but it can deliver huge currents that burn and start fires. Charging it gives off explosive hydrogen, so ventilate well."
    ] },
  { id: "c3-2", track: "manual", ch: 3, title: "Tools, and working safely", codes: ["8B2", "8B3", "8B4", "8B5", "8D1"],
    body: [
      "In safety questions, the RSGB answer is almost always the one about avoiding injury.",
      "Clamp work in a vice before drilling: a drill can grab loose work and spin it. Remove the chuck key before switching on, and make a small dent with a centre punch first so the bit doesn't wander.",
      "Wear safety glasses when drilling, cutting or soldering. Keep fingers behind a screwdriver's blade.",
      "Transmitting from a parked car? Think about people nearby, who may be within the EMF compliance distance of your antenna."
    ] },
  { id: "c3-3", track: "manual", ch: 3, title: "Reading component markings", codes: ["9C1"], gens: ["colour"],
    body: [
      "Resistor colour bands give two digits and then a multiplier. Yellow, violet, orange means 4, 7, then times a thousand: 47 kilohms. The colour code is printed in EX308, so practise reading it.",
      "A fourth band shows the tolerance: gold is plus or minus 5 percent, silver 10.",
      "On circuit diagrams and small parts, the letter R or k marks the decimal point. 4R7 is 4.7 ohms; 3k3 is 3.3 kilohms.",
      "Small capacitors often carry three digits: two figures and then the number of zeros, in picofarads. 103 is 10 followed by three zeros: 10,000 picofarads, or 10 nanofarads."
    ] },
  { id: "c3-4", track: "manual", ch: 3, title: "Construction and soldering", codes: ["9D1", "9E1", "9E2", "9E4"],
    body: [
      "Soldering joins parts by melting a low-melting-point alloy around them. The parts themselves don't melt.",
      "Flux, inside the solder, stops the metal oxidising and helps the solder flow. Clean surfaces and enough heat give a bright, smooth joint. A dull, grainy one is a bad joint.",
      "Keep the iron's tip tinned: clean it, then coat it with a little fresh solder. That stops it oxidising and helps the heat get into the joint.",
      "Inside equipment, thin metal screens between stages stop signals coupling where they shouldn't, and cut unwanted radiation."
    ] }
);

window.LESSONS.push(
  // ── CHAPTER 4: BASIC ELECTRONICS ──
  { id: "c4-1", track: "manual", ch: 4, title: "Current, voltage, resistance and power", codes: ["2A1", "2B1"], gens: ["power"],
    body: [
      "Current is a flow of electric charge, measured in amps. Voltage, measured in volts, is the push that drives it. Resistance, in ohms, is how strongly something opposes the flow.",
      "Conductors such as copper let current flow easily. Insulators such as plastic and glass hardly let any through. Resistors sit in between, made to a chosen value.",
      "Every component is made to a tolerance. A 100 ohm resistor with 5 percent tolerance could measure anywhere from 95 to 105 ohms, and that's perfectly normal.",
      "Power, in watts, is how fast energy is being used: volts times amps. It can also be worked out as current squared times resistance, or volts squared divided by resistance. All three are on the EX308 formula page."
    ] },
  { id: "c4-2", track: "manual", ch: 4, title: "Ohm's law", ids: ["2C1-1", "2C1-5", "2C1-6"], gens: ["ohmsI", "ohmsV"],
    body: [
      "Ohm's law ties the three together: voltage equals current times resistance. V equals I R.",
      "Use the triangle: V on top, I and R underneath. Cover the one you want. Current is V over R; resistance is V over I.",
      "Convert to plain units first: milliamps to amps, kilohms to ohms. Or use the short cut: volts divided by kilohms gives milliamps.",
      "With the resistance fixed, current follows voltage. Double the voltage and the current doubles."
    ] },
  { id: "c4-3", track: "manual", ch: 4, title: "Resistors in series and parallel", ids: ["2C1-2", "2C1-3", "2C1-4"], gens: ["series", "parallel2", "parallel3"],
    body: [
      "In series, one after another, resistances simply add. The same current flows through each.",
      "In parallel, side by side, the total is always less than the smallest one, because each extra path lets more current through.",
      "For two in parallel, use product over sum: multiply them, then divide by their total. Two equal resistors in parallel give half of one.",
      "For three or more, add up one divided by each, then take one divided by the answer. The formula's in your booklet."
    ] },
  { id: "c4-4", track: "manual", ch: 4, title: "Potential dividers", codes: ["2C2"], gens: ["divider"],
    body: [
      "Two resistors in series across a supply share the voltage between them, in proportion to their values. That's a potential divider.",
      "The output across the bottom resistor is the supply times the bottom resistor, divided by the total.",
      "Equal resistors split it equally. If the bottom one is twice the top one, it takes two thirds of the voltage.",
      "Quick check: the bigger resistor always takes the bigger share."
    ] },
  { id: "c4-5", track: "manual", ch: 4, title: "Batteries and internal resistance", codes: ["2C3"], gens: ["internalR"],
    body: [
      "Every battery or power supply behaves as if it has a small resistor hidden inside it: its internal resistance.",
      "With nothing connected, you measure the full voltage, called the EMF. Draw current and some voltage is lost across that hidden resistor, so the terminal voltage sags.",
      "To find the EMF from two readings: the extra drop divided by the extra current gives the internal resistance. Then add back what's lost at either reading.",
      "That's why a heavy transmitter load can pull a weak supply's voltage down."
    ] },
  { id: "c4-6", track: "manual", ch: 4, title: "Capacitors", codes: ["2D1", "2D2", "2D3"], gens: ["capPar"],
    body: [
      "A capacitor is two conducting plates separated by an insulator, the dielectric. It stores energy in the electric field between the plates. Capacitance is measured in farads, though real values are microfarads, nanofarads or picofarads.",
      "Bigger plates, closer together, and a better dielectric all give more capacitance.",
      "Capacitors combine the opposite way to resistors. In parallel they add. In series, use product over sum, and the total is less than the smallest.",
      "Electrolytic capacitors are polarised. Fit one the wrong way round and it can overheat, vent or even burst."
    ] },
  { id: "c4-7", track: "manual", ch: 4, title: "Inductors", codes: ["2D4", "2D5", "2D6"], gens: ["indSer"],
    body: [
      "Current through a coil creates a magnetic field, and the coil stores energy in it. That's an inductor, measured in henries.",
      "When a conductor and a magnetic field move relative to each other, a voltage is induced. That's how generators and transformers work.",
      "More turns, a bigger diameter, closer spacing, or a core of iron or ferrite all increase inductance. Moving a ferrite slug in or out is a neat way to tune a coil.",
      "Inductors combine like resistors: in series they add, and in parallel the total is smaller."
    ] },
  { id: "c4-8", track: "manual", ch: 4, title: "AC: frequency, period and RMS", codes: ["2E2", "2E3"], gens: ["period", "rms"],
    body: [
      "Alternating current swings back and forth. Frequency is how many complete cycles happen each second, in hertz. Period is the time for one cycle: one divided by the frequency.",
      "Kilohertz pairs with milliseconds, megahertz with microseconds. 1 megahertz has a period of 1 microsecond.",
      "The difference in timing between two waves is their phase, measured in degrees. One whole cycle is 360 degrees.",
      "RMS is the heating value of AC: the DC voltage that would warm a resistor just as much. For a sine wave it's 0.707 times the peak. Peak-to-peak is twice the peak."
    ] },
  { id: "c4-9", track: "manual", ch: 4, title: "Reactance and impedance", codes: ["2E1", "2E4", "2E5", "2E6"],
    body: [
      "Capacitors and inductors resist AC in a way that depends on frequency. That's called reactance, and like resistance it's measured in ohms, because it's a ratio of volts to amps.",
      "A capacitor passes AC but blocks DC. Its reactance falls as frequency rises.",
      "An inductor does the opposite: it passes DC, and its reactance rises with frequency. That's why a coil can be used as an RF choke.",
      "Reactance stores energy and gives it back, rather than turning it into heat. Impedance is the overall ratio of voltage to current when resistance and reactance are combined."
    ] },
  { id: "c4-10", track: "manual", ch: 4, title: "Wavelength", codes: ["2E7", "2E8"], gens: ["wavelength"],
    body: [
      "Radio waves travel at the speed of light, 300 million metres a second. So wavelength in metres is 300 divided by the frequency in megahertz.",
      "7 megahertz is about 43 metres. 145 megahertz is about 2 metres. A half-wave dipole is half the wavelength long.",
      "Working backwards: a 10 metre dipole is half of 20 metres, and 300 divided by 20 is 15 megahertz.",
      "Along a feeder at one instant, the wave repeats every wavelength. A quarter wave along is 90 degrees, so a peak becomes zero. Half a wave along is 180 degrees: the opposite peak."
    ] },
  { id: "c4-11", track: "manual", ch: 4, title: "Transformers", codes: ["2G1"], gens: ["turns"],
    body: [
      "A transformer is two coils sharing a magnetic field, usually wound on an iron or ferrite core that concentrates the field.",
      "The voltage ratio equals the turns ratio. Fewer turns on the secondary steps the voltage down; more turns steps it up.",
      "1000 primary turns, 50 secondary turns, 230 volts in: 230 times 50 over 1000 is 11.5 volts out.",
      "It only works with a changing current. Steady DC makes no changing field, so nothing is induced."
    ] },
  { id: "c4-12", track: "manual", ch: 4, title: "Tuned circuits", codes: ["2H1", "2H2", "2H3", "2H4"],
    body: [
      "Put an inductor and a capacitor together and you have a tuned circuit. At one frequency, the resonant frequency, their reactances are equal, and energy swaps back and forth between the capacitor's electric field and the coil's magnetic field.",
      "A series tuned circuit has minimum impedance at resonance. A parallel one has maximum impedance. Series small, parallel peak.",
      "More inductance or more capacitance lowers the resonant frequency. Less raises it.",
      "Q describes how sharp the response is. High Q gives a narrow peak and good selectivity. Low Q gives a broad, flat response."
    ] },
  { id: "c4-13", track: "manual", ch: 4, title: "Filters", codes: ["2H5"],
    body: [
      "Filters are named after what they let through. A low-pass filter passes frequencies below its cut-off. A high-pass filter passes those above.",
      "A band-pass filter passes one range of frequencies and rejects those either side. A band-stop, or notch, filter does the opposite: it cuts out one narrow band.",
      "You'll meet these again. A low-pass filter after a transmitter removes harmonics. A high-pass filter on a TV aerial keeps HF signals out."
    ] },
  { id: "c4-14", track: "manual", ch: 4, title: "Sampling: analogue into digital", codes: ["2F1"],
    body: [
      "To process a signal digitally, it's measured, or sampled, many times a second, and each sample is stored as a number.",
      "To capture a signal properly, you must sample at more than twice its highest frequency. That minimum is the Nyquist rate. A 3 kilohertz audio signal needs more than 6 kilohertz sampling.",
      "More bits per sample means finer steps in level. A higher sampling rate means finer steps in time. Both make the copy more accurate; the error left over is a form of distortion."
    ] }
);
