# Editing site content

All case studies, experience, testimonials and playground images live in
`content/` as JSON. The page loads them at view time, so nothing is tied to Framer.

| File | What's in it |
| --- | --- |
| `content/case-studies.json` | Case studies, in homepage order |
| `content/site.json` | Experience, testimonials, playground images |
| `assets/uploads/` | Images uploaded through the CMS |

The intro text, header and footer are in `index.html`.

## Editing in Pages CMS

1. Go to https://app.pagescms.org and sign in with GitHub.
2. Install the Pages CMS GitHub app on the `ekpeshie/new` repository when asked.
3. Open the repo, pick the `portfolio-site` branch, and edit.
4. Saving commits to the branch; Vercel redeploys within a minute.

The fields are defined in `.pages.yml`. Empty fields and sections are skipped
on the site, so a case study can be published with only some sections filled in.

## Moving the old Framer images into the repo

Some images still load from `framerusercontent.com`. To copy them in and point
the content at the local copies, run once from the repo root (Node 18+):

```sh
node scripts/localize-images.mjs
```

Then commit `assets/uploads/` and `content/`.

## Previewing locally

The page fetches the JSON files, so open it through a local server rather than
double-clicking `index.html`:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```
