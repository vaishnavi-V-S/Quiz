# Netlify deployment

This project is plain HTML, CSS, and browser JavaScript. It does not need Node.js, a package install, or a build step.

## Quick deploy

1. Open https://app.netlify.com/drop
2. Drag the dist folder from this project into the drop area.
3. Netlify publishes the website and displays its public URL.

## Deploy from GitHub

Import the repository into Netlify. The netlify.toml configuration sets the publish directory to dist. Leave the build command blank.

The deployed site is responsive and can be opened from a phone. Student records are stored separately in each browser's LocalStorage; use a shared backend before relying on a cross-device admin results view.
