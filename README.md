# KLE Society's BCA College, Ankali — MCQ Quiz

A responsive, local-first quiz portal for managing a 40-question, 60-minute MCA/PGCET-style assessment. Students register, take a shuffled quiz, see their score, and review responses. Admins manage the source question bank and answer verification, monitor results, rank classes, and export XLSX workbooks.

## Source question availability

The supplied PDF contains 100 numbered questions in its extracted content (the cover instructions refer to a 120-question exam). `data/questions.json` includes 67 questions whose text and four options could be transcribed reliably from the PDF text layer. Questions dependent on missing diagrams/tables or whose math/OCR text was incomplete were left out rather than guessed. This is a partial source transcription, not a reconstruction of all 100 questions. The PDF does not include an official answer key. To make the quiz usable, 64 answer keys have been independently worked from the question text and standard rules; they are explicitly marked as non-official in the data and Admin interface. Three ambiguous/unkeyed questions remain disabled from quiz selection. Review the independently worked answers before using this for a formal assessment.

## Requirements and run

- Node.js 18 or later
- Internet access during `npm install` to fetch SheetJS (unless already cached). Google Fonts are optional; system font fallbacks are included.

```sh
npm start
```

Open `http://localhost:3000`. You may also open `index.html` directly, but the local server is recommended. XLSX export uses the locally installed SheetJS package, so it works without a third-party CDN after installation.

## Admin access

Select **Admin Login**. Demo credentials are `admin` / `admin123`. These credentials and the session check are client-side demonstration authentication, not production security. Do not use this build to protect sensitive student data.

## Student flow

1. Register with a unique registration number, name, semester, and class.
2. Read instructions and acknowledge them.
3. Start the quiz once the dashboard reports at least 40 verified, enabled questions.
4. Answer and navigate between questions; answers and the shuffled quiz snapshot are saved immediately.
5. Submit manually or allow the timestamp-based 60-minute timer to submit.
6. Review the result and question-by-question answers.

The source question bank is loaded once from `data/questions.json` into LocalStorage, preserving any pre-existing local questions and admin edits. The question and option shuffles use Fisher–Yates. Option IDs remain attached to their answer text. Scoring is derived from the saved question answer key, with correct = 1, wrong/unanswered = 0.

## Manage questions and answers

In **Admin → Question & answer key**, add the exact source wording and all four source options. Pick the correct option only when supported by a verified key, explanation, or other trusted check, and tick the verification acknowledgement. Unverified questions can be saved without a correct answer but are not eligible for the quiz. Questions can be searched, edited, disabled, enabled, or deleted. Do not mark an uncertain answer verified.

The seeded question bank is `data/questions.json`. On first use, question records are kept in the browser's `kleBcaQuestionBank` localStorage key. For additional questions, use the admin interface or load records with fields `id`, `sourceQuestionNumber`, `question`, `options` (four `{id,text}` records), `correctOptionId`, `category`, `image`, `explanation`, `verified`, and `enabled`.

## Results, ranking, and exports

Admin **Student records** supports search, class and semester filters, score/date sorting, result detail, and resetting one selected attempt with confirmation. **Class-wise results** lists completed attempts per class. Top rankings show ranks 1 and 2, including all students tied at the second-place cutoff; equal scores share a rank. Export All Results creates `KLE_BCA_Quiz_Results.xlsx` with separate `BCA 1st Year`, `BCA 2nd Year`, and `BCA 3rd Year` worksheets. Individual class buttons export one class. Each sheet contains registration, student, class, answer counts, score, percentage, dates, time taken, and status.

## Persistence and production notes

Data is stored in browser LocalStorage under `kleBcaStudents`, `kleBcaResults`, `kleBcaQuestionBank`, `kleBcaCurrentQuiz`, and `kleBcaAdmin`. A current quiz stores the fixed question order, each question's option order, answers, and start/end timestamps, enabling refresh recovery without rerandomizing. Browser storage is device/browser-specific, can be edited by the user, and is not a secure source of truth. The demo does not provide server-side identity, attempt locking across devices, server-validated scoring, encrypted storage, or backups. The admin demo credential is visible in source. For production, add server authentication and authorization, server-side validation and scoring, a MySQL-backed repository/API, audit logging, HTTPS, and appropriate data retention controls. Keep the storage functions in `js/app.js` as the boundary to replace with an API-backed data layer.

## Project structure

```text
index.html
css/style.css
js/app.js
data/questions.json
server.js
package.json
README.md
```
