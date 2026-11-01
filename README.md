# Intermediate Trainer

Private spaced-repetition study app for the RSGB Intermediate exam (syllabus v1.6b).
Each person has their own username, password and progress.

## Setup on Netlify (once)

1. Netlify → **Add new site → Import an existing project** → GitHub → `rsgb-intermediate`.
2. Leave the build settings as they are (publish directory `public` comes from `netlify.toml`).
3. **Site configuration → Environment variables → Add a variable**: key `SITE_PASSWORD`, value = your chosen password.
   Optionally add `INVITE_CODE` too: new people then need that code to sign up. Without it, anyone who finds the site can create an account.
4. **Deploys → Trigger deploy**.
5. On your iPhone, open the site in Safari → Share → **Add to Home Screen**.

## What's where

- `public/data/questions.js`: question bank (original questions, keyed to syllabus codes)
- `public/data/generators.js`: calculation questions with fresh numbers each time
- `public/data/lessons.js`: maths refresher and section explainers (read aloud by the phone)
- `public/data/ex308.js`: Schedule 1 data for "find it in the booklet" drills
## Accounts

- People create their own account at `/signup.html` (with the invite code, if one is set). No approval needed.
- Andy logs in as `andy` with the `SITE_PASSWORD` password; his account and existing progress carry on.
- `SITE_PASSWORD` also signs everyone's login, so changing it logs everyone out (their accounts and progress are kept).
- To remove someone: Netlify → **Blobs** → `users` store → delete their entry (their progress is in the `progress` store under the same name).

## What's where (code)

- `netlify/edge-functions/gate.js`: login gate for every page
- `netlify/functions/auth.mjs`: sign up, log in, log out (accounts in Netlify Blobs)
- `netlify/lib/session.js`: signed login cookies
- `netlify/functions/progress.mjs`: each person's progress sync via Netlify Blobs
