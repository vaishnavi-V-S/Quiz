# Publish the mobile-ready static site

The static upload bundle is in `dist/`. It includes the page, styling, app code, question bank, and a local copy of SheetJS.

## Cloudflare Pages (free)

1. Sign in to Cloudflare and open **Workers & Pages**.
2. Choose **Create application → Get started → Drag and drop your files**.
3. Create a project name, then upload the contents of `dist/` (or the prepared `kle-bca-quiz-hosting.zip`).
4. Select **Deploy site**. Cloudflare will show the public `https://<project-name>.pages.dev` URL. It is responsive and can be opened from a phone.

## Vercel

Import the project into Vercel or use its CLI after signing in. Set the project root/output directory to `dist` and leave the build command empty; this is a plain static HTML site.

## Important data limitation

This first version uses each browser's LocalStorage. If students take quizzes on separate phones, their registrations and results stay on those phones and will not appear in an admin dashboard on another device. A shared database/API must be added before using a public deployment for centralized class results. The demo admin password is also visible in the client code; do not use it for sensitive records.
