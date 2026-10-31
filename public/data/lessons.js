// Micro-lessons. Each is short enough to listen to in about 90 seconds.
// "gens" are calculation generators used for practice after the lesson.
window.LESSONS = [
  // ── MATHS FROM SCRATCH ──
  { id: "m1", track: "maths", title: "Prefixes: the only maths that trips everyone up",
    body: [
      "Nearly every calculation in the exam is easy once the prefixes are right. There are only six you need.",
      "Kilo, written k, means a thousand. Mega, capital M, means a million. Going the other way: milli, small m, is a thousandth. Micro, the Greek letter µ, is a millionth. Nano, n, is a thousand-millionth, and pico, p, is a million-millionth.",
      "So 4.7 kilohms is 4,700 ohms. 20 milliamps is 0.02 amps. 10 microfarads is 0.00001 farads.",
      "Each step along the ladder pico, nano, micro, milli, unit, kilo, mega is a factor of a thousand. Converting means shifting the decimal point three places per step.",
      "A short cut worth remembering: volts divided by kilohms gives milliamps. 12 volts across 4 kilohms is 3 milliamps, no zeros needed."
    ], gens: ["ohmsI"] },
  { id: "m2", track: "maths", title: "Ohm's law and the triangle",
    body: [
      "Ohm's law links voltage, current and resistance: V equals I times R.",
      "Draw a triangle. V at the top, I and R side by side underneath. Cover the one you want. Cover V and you see I times R. Cover I and you see V over R. Cover R and you see V over I.",
      "Always convert to plain units first. Milliamps to amps by dividing by a thousand. Kilohms to ohms by multiplying by a thousand.",
      "Example: 20 milliamps through 470 ohms. 0.02 times 470 is 9.4 volts."
    ], gens: ["ohmsI", "ohmsV"] },
  { id: "m3", track: "maths", title: "Series and parallel",
    body: [
      "Resistors in series just add up. 1k plus 2k plus 3k is 6k.",
      "Resistors in parallel always come out smaller than the smallest one. For two of them, use product over sum: multiply them, then divide by their total. 2k and 3k: 6 divided by 5 is 1.2k.",
      "Two equal resistors in parallel? Just halve one. Three equal? Divide by three.",
      "For three different values, on a phone calculator do one divided by each value, add them up, then do one divided by the answer. The formula is printed in EX308.",
      "Inductors behave exactly like resistors. Capacitors are the odd ones out and work backwards: in parallel they add, in series use product over sum."
    ], gens: ["series", "parallel2", "parallel3", "capPar", "indSer"] },
  { id: "m4", track: "maths", title: "Sharing: potential dividers and transformers",
    body: [
      "A potential divider shares the supply voltage in proportion to the resistances. The bigger resistor takes the bigger share.",
      "Output across the bottom resistor equals supply times bottom resistor divided by the total. 12 volts, 1k on top, 2k below: 12 times 2 over 3 is 8 volts.",
      "Transformers share by turns. Output volts over input volts equals secondary turns over primary turns. Fewer turns on the secondary: step down. More: step up.",
      "Batteries have a hidden resistor inside. Draw more current and the terminal voltage sags. Work out the internal resistance from the drop, then add back what's lost to find the open-circuit voltage, the EMF."
    ], gens: ["divider", "turns", "internalR"] },
  { id: "m5", track: "maths", title: "Decibels by doubling",
    body: [
      "You never need logarithms. You need two facts: 3 decibels doubles the power, and 10 decibels multiplies it by ten.",
      "Build everything else from those. 6 dB is two doublings: times 4. 9 dB is times 8. 13 dB is 10 plus 3: times 20. 20 dB is 10 plus 10: times 100.",
      "Losses work the same way in reverse. A feeder with 3 dB loss delivers half. 10 dB loss delivers a tenth.",
      "dBW means compared with one watt. 10 watts is 10 dBW, 100 watts is 20 dBW, and doubling adds 3. So 200 watts is 23 dBW, 400 is 26, 800 is 29.",
      "In a system, gains and losses in dB simply add and subtract."
    ], gens: ["dbRatio", "dbW", "feeder", "erp"] },
  { id: "m6", track: "maths", title: "Wavelength, frequency and period",
    body: [
      "Wavelength in metres equals 300 divided by frequency in megahertz. 7 megahertz: 300 over 7, about 43 metres. 145 megahertz: about 2 metres.",
      "A half-wave dipole is half of that. If you're told the dipole is 10 metres long, the wavelength is 20, and the frequency is 300 over 20, which is 15 megahertz.",
      "Period is the time for one cycle: one divided by frequency. Kilohertz pairs with milliseconds, megahertz with microseconds. 200 hertz has a period of 5 milliseconds.",
      "RMS is the heating value of AC. For a sine wave, RMS equals 0.707 times peak. Peak-to-peak is twice the peak."
    ], gens: ["wavelength", "period", "rms"] },
  { id: "m7", track: "maths", title: "Power, fuses and efficiency",
    body: [
      "Power in watts equals volts times amps. 13.8 volts at 10 amps is 138 watts.",
      "For mains, flip it round: current equals power divided by 230. A 690 watt kettle draws 3 amps, so it needs the next fuse up, 5 amps.",
      "Amplifier efficiency: RF out equals DC in times the efficiency. 100 watts in at 60 percent gives 60 watts of RF. The other 40 watts is heat.",
      "Transistor gain, beta, is collector current divided by base current. Beta 100 and 20 microamps in the base gives 2 milliamps in the collector."
    ], gens: ["power", "fuse", "efficiency", "beta"] },

  // ── SECTION EXPLAINERS ──
  { id: "s1", track: "section", sec: 1, title: "Licensing in 90 seconds",
    body: [
      "Your licence covers the UK, the Channel Islands, the Isle of Man, their territorial waters, and UK-registered ships and aircraft. A foreign-flagged ship: no transmitting.",
      "The regional letters: D Isle of Man, E England, I Northern Ireland, J Jersey, M Scotland, U Guernsey, W Wales. They're compulsory for 2-series callsigns like yours.",
      "Operating someone else's kit beyond your limits means their callsign and their direct supervision, with the regional letter for where the station actually is.",
      "User services are the emergency responders and local government. Only they can ask you to pass messages, and only they or satellite control justify encryption.",
      "EMF: if you can exceed 10 watts EIRP average or 100 watts EIRP peak, you need a full assessment and records. Redo it when anything changes, such as a new antenna.",
      "Remote control links must be secure. On amateur bands they must be above 30 megahertz and not encrypted. Unattended remote kit shows your licence number.",
      "Schedule 1 is in your booklet. Don't memorise it; practise finding things in it."
    ] },
  { id: "s2", track: "section", sec: 2, title: "Components that store energy",
    body: [
      "Capacitors store energy in an electric field between two plates. They pass AC but block DC, and their reactance falls as frequency rises.",
      "Inductors store energy in a magnetic field around a coil. They pass DC but oppose AC, and their reactance rises with frequency.",
      "Put one of each together and you have a tuned circuit. At resonance their reactances are equal. In series that gives minimum impedance; in parallel, maximum.",
      "More inductance or more capacitance lowers the resonant frequency. Higher Q means a sharper, more selective response.",
      "A transformer is two coils sharing a magnetic field. It only works with changing current, so never DC."
    ] },
  { id: "s2b", track: "section", sec: 2, title: "Diodes, transistors and power supplies",
    body: [
      "A diode conducts one way only, once about 0.6 volts has overcome the depletion layer. That one-way action is rectification.",
      "A varicap is a diode used reverse-biased as a capacitor: more reverse voltage, less capacitance. It's how FM and electronic tuning are done.",
      "A bipolar transistor uses a small base current to control a larger collector current. Beta is collector over base. Biasing sets its resting voltages.",
      "Power supplies: transformer, rectifier, reservoir capacitor, regulator. A half-wave rectifier needs a bigger smoothing capacitor than full-wave or bridge.",
      "Switch-mode supplies are smaller, lighter and more efficient, but can spray RF interference."
    ] },
  { id: "s3", track: "section", sec: 3, title: "How a superhet works",
    body: [
      "A superhet mixes the incoming signal with a local oscillator to make a fixed intermediate frequency, the sum or the difference.",
      "Because the IF never changes, its filters can be very selective, and the radio can work on many bands.",
      "The RF amplifier is broadly tuned and selects a range including the wanted signal. The sharp selection happens at the IF.",
      "Detectors: a diode for AM. A beat frequency oscillator for CW. A carrier insertion oscillator and product detector for SSB. A discriminator for FM.",
      "AGC senses signal strength at the detector and adjusts the gain. The same voltage drives the S-meter.",
      "A software defined radio digitises the signal and uses a Fourier transform to show the spectrum and waterfall. A low-pass filter before the converter stops aliasing."
    ] },
  { id: "s3b", track: "section", sec: 3, title: "Clean transmitters",
    body: [
      "A balanced modulator gives two sidebands with no carrier. A band-pass crystal filter keeps one: that's SSB.",
      "FM comes from audio wobbling a varicap in the oscillator. Peak deviation is the biggest frequency swing, set by how loud the audio is.",
      "Harmonics are multiples of your frequency. A low-pass filter after the power amplifier removes them.",
      "Key clicks come from keying with edges that are too sharp. Chirp is the frequency sliding as you key, usually from an unstable supply.",
      "Bandwidth from narrow to wide: CW, SSB, AM, FM."
    ] },
  { id: "s4", track: "section", sec: 4, title: "Feeders and antennas",
    body: [
      "Amateur coax is 50 ohms; TV coax is 75. Twin feeder has lower loss and doesn't radiate because its equal and opposite currents cancel.",
      "A choke balun stops RF flowing on the outside of the braid, the common-mode current.",
      "A dipole is about 73 ohms in theory and close to 50 in practice. It has 2.15 dB gain over an isotropic source.",
      "Yagi: the reflector is longer, the directors shorter, and the feeder goes to the driven element. Beamwidth is measured between the half-power points.",
      "Traps are parallel tuned circuits that let one antenna work several bands.",
      "An ATU fools the transmitter into seeing a good match. It does nothing to the SWR on the feeder beyond it."
    ] },
  { id: "s5", track: "section", sec: 5, title: "Propagation",
    body: [
      "Ground wave hugs the earth and dies off faster at higher frequencies.",
      "Sky wave bends back from the ionosphere, which the sun ionises. Layers from low to high: D, E, F1, F2. F1 and F2 merge at night.",
      "The D layer absorbs low HF in daytime and vanishes at night. That's why 80 and 160 metres open up after dark.",
      "One hop off the E layer: about 2,000 kilometres. Off F2: about 4,000. Sporadic E can lift 28 megahertz and VHF in summer.",
      "MUF is the highest frequency that comes back; LUF the lowest that isn't absorbed. If LUF is above MUF, the path is closed.",
      "Polarisation is the plane of the electric field. At VHF, reflections off buildings and aircraft cause multipath."
    ] },
  { id: "s6", track: "section", sec: 6, title: "EMC: cures go at the victim",
    body: [
      "All electronic equipment can radiate and pick up RF. EMC is about everything getting along.",
      "SSB and AM cause speech-like breakthrough on audio kit and phones. Digital TV freezes and goes blocky. DAB mutes.",
      "Fit filters at the affected equipment. To protect a UHF TV from your HF signal, put a high-pass filter at the TV aerial socket.",
      "Ferrite rings choke common-mode currents on leads and coax braid. Masthead amplifiers can overload on your signal.",
      "A good RF earth is a dedicated stake, never water or gas pipes. Keep antennas away from house wiring, and use screened mic leads."
    ] },
  { id: "s7", track: "section", sec: 7, title: "Operating",
    body: [
      "The Q codes to know: QRM interference, QRN noise, QRO more power, QRP low power, QRT stop sending, QSB fading, QSL confirm, QSO a contact, QSY change frequency, QTH location.",
      "Prefixes: EI Ireland, F France, I Italy, JA Japan, PA Netherlands, VE Canada, VK Australia, W USA, ZL New Zealand.",
      "Band plans come from the IARU. No SSB on 30 metres; no contests on 30, 17, 12 or 60. Lower sideband below 10 megahertz, upper above.",
      "Satellites: in view only part of the time, uplink and downlink on different bands, allow for Doppler, use minimum power."
    ] },
  { id: "s8", track: "section", sec: 8, title: "Safety: always pick the injury answer",
    body: [
      "Big capacitors can bite after switch-off. Bleed resistors discharge them, but check anyway.",
      "Fuse to just above the current drawn: current equals power divided by 230.",
      "Clamp work before drilling, remove the chuck key, use a centre punch. A pillar drill is safer than a hand drill.",
      "Charging car batteries gives off explosive hydrogen, so ventilate.",
      "In safety questions, the RSGB answer is almost always the one about avoiding injury or shock."
    ] },
  { id: "s9", track: "section", sec: 9, title: "Measurement and soldering",
    body: [
      "Voltmeters go across, in parallel, with high resistance. Ammeters go in series, with low resistance.",
      "Analogue meters are best for tuning to a peak.",
      "Decibels: 3 dB doubles, 10 dB times ten. The colour code is in your booklet: just practise reading it. R marks a decimal point: 4R7 is 4.7 ohms.",
      "Soldering melts a low-temperature alloy around the joint. Flux stops oxidation. Clean and tin the iron's tip."
    ] }
];
