# Deploy to Netlify

This project uses static HTML/CSS/JavaScript for the website plus a Netlify Edge Function for shared results. It has no Node.js application or `package.json`.

## Deploy

1. In Netlify, import `https://github.com/vaishnavi-V-S/web.git`.
2. Set the build command to blank and publish directory to `dist` (already declared in `netlify.toml`).
3. Deploy from the Git-connected repository. The Edge Function is in `netlify/edge-functions/api.js`; a static drag-and-drop deploy will not publish it.
4. In Netlify site environment variables, add `ADMIN_USERNAME` and `ADMIN_PASSWORD` with Functions scope, then trigger a new deploy.
5. Open `/api/health` on the deployed domain and confirm it returns `{"ok":true}`.

Quiz submissions are scored against the verified question bank in the Edge Function and persisted in the site-wide Netlify Blobs store. The admin dashboard fetches these shared records, including class-wise results and exports. Student browsers with older local-only completed attempts should reopen the new site once so pending results can sync.
