# KLE Society's BCA College, Ankali — MCQ Quiz

A responsive quiz website built with plain HTML, CSS, and browser JavaScript. It includes student registration, a randomized 40-question quiz, timer, scoring, answer review, an admin dashboard, class-wise results, and Excel export.

## Source questions and answers

The question bank contains 67 questions transcribed from the supplied Karnataka PGCET MCA paper. Some diagram-dependent or unclear questions were omitted rather than guessed. The paper did not include an official answer key. 64 answers are independently worked from the question text and are labelled non-official in the admin dashboard and data. Review them before using the quiz for formal assessment.

## Deploy to Netlify

This is a static website. There is no Node.js runtime, install step, or build command.

- Drag the dist folder into Netlify Drop: https://app.netlify.com/drop
- Or import this GitHub repository into Netlify. The included netlify.toml sets dist as the publish directory; leave the build command empty.

Netlify serves the site on a public URL that works on desktop and mobile browsers. To update a manual deploy, upload the updated dist folder again.

## Features

- Registration with registration number, student name, semester, and BCA class.
- Fisher–Yates randomization of verified questions and option order.
- 60-minute timestamp-based countdown, answer autosave, refresh recovery, and automatic submission.
- Automatic scoring and post-quiz answer review.
- Admin demo login, question/answer-key management, student records, filters, rankings, and attempt reset.
- Excel exports with separate worksheets for each BCA year.
- Responsive layouts for desktop, tablet, and phone.
- SheetJS is included as a local browser asset under assets/vendor.

## Admin demo access

Username: admin
Password: admin123

This is client-side demonstration authentication. Do not use this build to protect sensitive student records.

## Storage limitation

Student, result, and question records use browser LocalStorage. Each browser/device has its own data; submissions from students' phones will not automatically appear in an admin's browser. Centralized class results require a shared API/database. LocalStorage is editable and is not secure production storage.

## Project structure

- index.html — website pages and navigation
- css/style.css — responsive styling
- js/app.js — quiz, registration, scoring, and admin logic
- data/questions.json — question bank seed
- assets/vendor/xlsx.full.min.js — local Excel export library
- dist/ — complete static site directory for Netlify
- netlify.toml — Netlify publish-directory configuration
