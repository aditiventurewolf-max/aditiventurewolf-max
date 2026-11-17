# Unobvious website

Static site (plain HTML, CSS, JS). No build step needed to deploy.
To change page content, edit `src/*.html` and run `python3 src/build.py`, then commit the regenerated pages.
Contact and domain settings are at the top of `src/build.py`.

## Deploy

**Firebase Hosting** (from this folder): `firebase init hosting` (keep the existing `firebase.json`), then `firebase deploy --only hosting`.
**Vercel**: import the repo, set the root directory to `site`, framework "Other". `vercel.json` is included.
**Railway**: new service from the repo, root directory `site`. The `Dockerfile` serves it with nginx on `$PORT`.
