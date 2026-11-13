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
