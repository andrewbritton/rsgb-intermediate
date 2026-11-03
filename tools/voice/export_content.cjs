// Prints the lessons and questions the app speaks, as JSON, for build_audio.py.
const path = require("path");
const data = path.join(__dirname, "..", "..", "public", "data");
global.window = global;
for (const f of ["sections", "questions", "lessons"]) require(path.join(data, f + ".js"));
process.stdout.write(JSON.stringify({
  lessons: LESSONS.map(l => ({ id: l.id, body: l.body })),
  questions: QUESTIONS.map(q => ({ id: q.id, q: q.q, opts: q.opts, x: q.x, hook: q.hook })),
}));
