# KLE Society's BCA College, Ankali — MCQ Quiz

A responsive quiz website built with plain HTML, CSS, and browser JavaScript. It includes student registration, a randomized 40-question quiz, timer, scoring, answer review, an admin dashboard, class-wise results, and Excel export.

## Source questions and answers

The question bank contains 74 questions transcribed from the supplied Karnataka PGCET MCA paper. Some diagram-dependent or unclear questions were omitted rather than guessed. The paper did not include an official answer key. 73 answer keys are independently worked from the question text and are labelled non-official in the admin dashboard and data. Question 66 has conflicting wording and options, so it remains unverified and disabled until an administrator resolves it. The PDF lists 100 numbered questions even though its general instructions say 120; only the 74 transcribed entries are included, and diagram-dependent/unclear items are omitted rather than reconstructed.

## Deploy to Netlify

The student interface is plain HTML, CSS, and browser JavaScript. Shared records and protected admin access use a Netlify Edge Function (Deno runtime) and Netlify Blobs. No Node.js application or package install is used.

Import this GitHub repository into Netlify. Keep the build command blank and publish directory set to `dist`; `netlify.toml` also registers the Edge Function. Use Git-based deploys so Netlify builds and publishes the Edge Function with the site. A drag-and-drop static-only deploy will not include shared result storage.

Netlify serves the site on a public URL that works on desktop and mobile browsers. To update a manual deploy, upload the updated dist folder again.

## Features

- Registration with registration number, student name, semester, and BCA class.
- Fisher–Yates randomization of verified questions and option order.
- 60-minute timestamp-based countdown, answer autosave, refresh recovery, and automatic submission.
- Automatic scoring and post-quiz answer review.
- Server-side admin login, question/answer-key management, shared student records, filters, rankings, and attempt reset.
- Excel exports with separate worksheets for each BCA year.
- Responsive layouts for desktop, tablet, and phone.
- SheetJS is included as a local browser asset under assets/vendor.

## Admin access

Admin login is handled by the Edge Function and uses an HttpOnly session cookie. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Netlify site environment variables (Functions scope) and redeploy to replace the compatibility defaults. Do not use the compatibility defaults for real student records.

## Data persistence

Active quiz recovery and question edits use browser LocalStorage. Completed attempts are also sent to the same-origin Netlify Edge API and stored in the site-wide Netlify Blobs store, so results from student phones appear in the admin dashboard. Pending local results retry on the next visit. A student must reopen the updated site once to upload any result that was completed before shared storage was deployed.

## Project structure

- index.html — website pages and navigation
- css/style.css — responsive styling
- js/app.js — quiz, registration, scoring, and admin logic
- data/questions.json — question bank seed
- assets/vendor/xlsx.full.min.js — local Excel export library
- dist/ — complete static site directory for Netlify
- netlify.toml — Netlify publish-directory configuration
