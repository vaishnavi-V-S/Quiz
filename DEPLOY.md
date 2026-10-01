# Deploy to Netlify

This project serves static HTML/CSS/JavaScript and uses a Netlify Edge Function for shared results. Its root `package.json` declares `@netlify/blobs`, required to bundle the Edge Function; no frontend build command is needed.

## Local preview

Use Netlify Dev rather than a basic static file server when testing administrator sign-in, shared questions, or student results. The static site alone does not provide `/api/*` routes. Link the checkout to the Netlify site first, then run `npx netlify-cli dev` from the project folder and open the local URL printed by the CLI. Configure `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the linked site's environment variables.

## Deploy

1. Push this project to a GitHub repository you control, then in Netlify select **Add new site → Import an existing project** and connect that repository.
2. Set the build command to blank and publish directory to `dist` (already declared in `netlify.toml`). Keep the Netlify Edge Function enabled; a static-only deploy does not provide shared login, questions, or results.
3. Deploy from the Git-connected repository. The Edge Function is in `netlify/edge-functions/api.js`; a static drag-and-drop deploy will not publish it.
4. In **Site configuration → Environment variables**, set strong, private `ADMIN_USERNAME` and `ADMIN_PASSWORD` values available to the Edge Function, then redeploy. Do not use the local preview credentials in production.
5. Open `/api/health` on the deployed `https://<your-site>.netlify.app` address and confirm it returns `{"ok":true}`. Share this HTTPS link with students; it opens on phones without an app install.
6. Sign in at `https://<your-site>.netlify.app/#admin-login` and confirm the shared results dashboard loads.

Quiz submissions are scored against the verified question bank in the Edge Function and persisted in the site-wide Netlify Blobs store. When a student completes or is forced to submit an assessment, their result is uploaded; the admin dashboard refreshes shared data every 15 seconds while open and also has a manual refresh button. Class-wise tables and each new Excel download use the latest fetched records. A workbook already downloaded to a device cannot change itself; export it again for newly synced results. Student browsers retry local pending results while online and on their next visit.

The public Netlify URL is sufficient for initial use. Optionally add a college-owned custom domain in Netlify's domain settings after the site is deployed.
