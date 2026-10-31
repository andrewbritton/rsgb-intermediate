# Intermediate Trainer

Private spaced-repetition study app for the RSGB Intermediate exam (syllabus v1.6b).

## Setup on Netlify (once)

1. Netlify → **Add new site → Import an existing project** → GitHub → `rsgb-intermediate`.
2. Leave the build settings as they are (publish directory `public` comes from `netlify.toml`).
3. **Site configuration → Environment variables → Add a variable**: key `SITE_PASSWORD`, value = your chosen password.
4. **Deploys → Trigger deploy**.
5. On your iPhone, open the site in Safari → Share → **Add to Home Screen**.

## What's where

- `public/data/questions.js`: question bank (original questions, keyed to syllabus codes)
- `public/data/generators.js`: calculation questions with fresh numbers each time
- `public/data/lessons.js`: maths refresher and section explainers (read aloud by the phone)
- `public/data/ex308.js`: Schedule 1 data for "find it in the booklet" drills
- `netlify/edge-functions/gate.js`: password gate (uses `SITE_PASSWORD`)
- `netlify/functions/progress.mjs`: progress sync via Netlify Blobs
