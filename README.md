# KLE Society's BCA College, Ankali — MCQ Quiz

A responsive quiz website built with plain HTML, CSS, and browser JavaScript. It includes student registration, a randomized 40-question quiz, timer, scoring, answer review, an admin dashboard, class-wise results, and Excel export.

## Source questions and answers

The question bank contains 74 questions transcribed from the supplied Karnataka PGCET MCA paper. Some diagram-dependent or unclear questions were omitted rather than guessed. The paper did not include an official answer key. 73 answer keys are independently worked from the question text and are labelled non-official in the admin dashboard and data. Question 66 has conflicting wording and options, so it remains unverified and disabled until an administrator resolves it. The PDF lists 100 numbered questions even though its general instructions say 120; only the 74 transcribed entries are included, and diagram-dependent/unclear items are omitted rather than reconstructed.

## Deploy to Netlify

The student interface is plain HTML, CSS, and browser JavaScript. Shared records and protected admin access use a Netlify Edge Function (Deno runtime) and Netlify Blobs. The root `package.json` declares the Edge Function's `@netlify/blobs` dependency so Netlify can bundle it during deployment.

Import this GitHub repository into Netlify. Keep the build command blank and publish directory set to `dist`; `netlify.toml` also registers the Edge Function. Use Git-based deploys so Netlify builds and publishes the Edge Function with the site. A drag-and-drop static-only deploy will not include shared result storage.

For local admin/API testing, link the checkout to the Netlify site and run `npx netlify-cli dev`. A basic static server supports a localhost-only preview admin sign-in (`admin` / `admin123`); preview questions/results are stored only in that browser and are not shared. Never rely on this preview login for a deployed site. Static deployments still require the Netlify Edge API for real administrator authentication and shared results.

Netlify serves the site on a public URL that works on desktop and mobile browsers. To update a manual deploy, upload the updated dist folder again.

## Features

- Registration with registration number, student name, semester, and BCA class.
- Fisher–Yates randomization of verified questions and option order.
- 60-minute timestamp-based countdown, answer autosave, refresh recovery, and automatic submission.
- Tab/page-leave monitoring, PrintScreen/Mac screenshot-shortcut handling, and focus-loss warnings during an assessment; the second detected warning automatically submits and closes the attempt. Browser screenshot detection is best-effort and cannot detect every operating-system capture method.
- Automatic scoring and post-quiz answer review.
- Server-side admin login, shared question-bank and answer-key management, shared registration/attempt records, filters, rankings, and attempt reset.
- The admin dashboard refreshes shared results every 15 seconds while open, refreshes when brought back into focus, and has a manual refresh button. Class-wise views and new Excel downloads use the latest fetched results.
- Admin PDF import with a locally bundled PDF reader for text-searchable question PDFs with four A-D options and an optional separate answer-key PDF. The parser handles common inline and row-based answer formats without requiring a third-party CDN. Extracted questions are previewed before import; matched answers are marked verified only after an administrator confirms the extraction. Scanned/image-only PDFs require OCR/manual entry.
- Excel exports with separate worksheets for each BCA year.
- Responsive layouts for desktop, tablet, and phone.
- Local SVG education illustrations on the home page for practice, timed focus, and answer review.
- A shared study-themed background slideshow across all pages, changing every two seconds with a soft crossfade; it respects reduced-motion preferences.
- SheetJS is included as a local browser asset under assets/vendor.

## Admin access

Admin login is handled by the Edge Function and uses an HttpOnly session cookie. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Netlify site environment variables (Functions scope) and redeploy to replace the compatibility defaults. Do not use the compatibility defaults for real student records.

## Data persistence

Active quiz recovery uses browser LocalStorage. On the deployed site, student registrations are immediately saved in Netlify Blobs and appear in the admin roster even if the student does not finish the quiz; completion updates that student's existing record with the score. Records do not expire automatically. The admin's explicit Reset action removes a result but retains the student's registration. No application code purges records after two days. Question edits are cached locally and synchronized through the same-origin Netlify Edge API to Netlify Blobs so students on other devices can access the shared question bank. If the connection is temporarily unavailable, completed results retry while online and when the student returns to the site. Admin result lists refresh while the dashboard is open. Excel workbooks are generated when an admin clicks Export, so download a new workbook to include newly synced results.

## Project structure

- index.html — website pages and navigation
- css/style.css — responsive styling
- js/app.js — quiz, registration, scoring, and admin logic
- data/questions.json — question bank seed
- assets/vendor/xlsx.full.min.js — local Excel export library
- dist/ — complete static site directory for Netlify
- netlify.toml — Netlify publish-directory configuration
