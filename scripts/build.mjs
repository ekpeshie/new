// Pre-renders the site into dist/ so search engines get real HTML:
//   - the homepage with projects, experience, testimonials and playground filled in
//   - one page per case study at /work/<slug>/ with its own title, description and metadata
//   - sitemap.xml
// Vercel runs this on every deploy (see vercel.json). Locally: node scripts/build.mjs
import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import { createRequire } from "node:module";

const SITE = "https://www.nuel.live";
const OUT = "dist";
const require = createRequire(import.meta.url);
const R = require("../assets/js/render.js");
const { esc } = R;

const template = await readFile("index.html", "utf8");
const cs = JSON.parse(await readFile("content/case-studies.json", "utf8"));
const site = JSON.parse(await readFile("content/site.json", "utf8"));
const projects = R.projects(cs);
const total = String(projects.length).padStart(2, "0");

// Replace the inner HTML of the element with this id (it must be empty in the template).
function fill(html, id, inner) {
  const re = new RegExp(`(<([a-z0-9]+)[^>]*\\bid="${id}"[^>]*>)(</\\2>)`);
  if (!re.test(html)) throw new Error(`build: #${id} not found or not empty in index.html`);
  return html.replace(re, (_, open, tag, close) => open + inner + close);
}
// Set an attribute value on the first tag matching `match` (a literal attribute snippet).
function attr(html, match, name, value) {
  const i = html.indexOf(match);
  if (i < 0) throw new Error(`build: ${match} not found`);
  const start = html.lastIndexOf("<", i), end = html.indexOf(">", i);
  const tag = html.slice(start, end + 1);
  const next = tag.replace(new RegExp(`${name}="[^"]*"`), `${name}="${esc(value)}"`);
  return html.slice(0, start) + next + html.slice(end + 1);
}
const clip = (s, n = 158) => {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length <= n ? t : t.slice(0, t.lastIndexOf(" ", n - 1)) + "…";
};
const abs = (u) => (/^https?:\/\//.test(u) ? u : SITE + (u.startsWith("/") ? u : "/" + u));

// Homepage: content is pre-rendered; the script re-renders the same markup on load.
let home = template;
home = fill(home, "projects-list", R.projectCards(projects));
home = fill(home, "roles-list", R.roles(site));
home = fill(home, "quotes-list", R.quotes(site));
home = fill(home, "playground-list", R.playground(site));

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
for (const p of ["assets", "content", "favicon.ico", "robots.txt", "404.html"]) {
  await cp(p, `${OUT}/${p}`, { recursive: true });
}
await writeFile(`${OUT}/index.html`, home);

// One page per case study, opened in the drawer.
for (let i = 0; i < projects.length; i++) {
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const r = R.caseStudy(p, next, total);
  const url = `${SITE}/work/${p.slug}/`;
  const title = `${p.name}${R.has(p.tagline) ? " — " + p.tagline : ""} · Emmanuel Abu-Ekpeshie`;
  const desc = clip(p.summary || p.card_description || p.tagline);
  const image = R.has(p.hero) ? abs(p.hero) : `${SITE}/assets/images/og.png`;

  let page = home;
  page = page.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  page = attr(page, 'name="description"', "content", desc);
  page = attr(page, 'rel="canonical"', "href", url);
  page = attr(page, 'property="og:type"', "content", "article");
  page = attr(page, 'property="og:title"', "content", title);
  page = attr(page, 'property="og:description"', "content", desc);
  page = attr(page, 'property="og:url"', "content", url);
  page = attr(page, 'property="og:image"', "content", image);
  page = attr(page, 'property="og:image:alt"', "content", `${p.name} case study`);
  page = attr(page, 'name="twitter:title"', "content", title);
  page = attr(page, 'name="twitter:description"', "content", desc);
  page = attr(page, 'name="twitter:image"', "content", image);
  // The hero image is a Framer screenshot of unknown size; drop the fixed dimensions.
  page = page.replace(/<meta property="og:image:(width|height)" content="\d+">\n/g, "");

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": url + "#case-study",
    url, name: `${p.name} case study`, headline: title,
    description: desc, image,
    ...(R.has(p.year) ? { dateCreated: p.year } : {}),
    author: { "@id": `${SITE}/#person` },
    isPartOf: { "@id": `${SITE}/#website` },
    inLanguage: "en"
  };
  page = page.replace("</head>", `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`);

  // Open the drawer in the HTML itself so the case study is visible without JavaScript.
  page = page.replace('<html lang="en">', '<html lang="en" class="drawer-open">');
  page = page.replace("<body>", '<body class="locked">');
  page = fill(page, "drawer-label", esc(r.label));
  page = fill(page, "case-study", r.html);
  page = fill(page, "cs-map-list", R.mapItems(r.entries));
  // The case study title becomes the page's main heading.
  page = page.replace('<h1 class="sr-only">', '<p class="sr-only">').replace(/(<p class="sr-only">[^<]*)<\/h1>/, "$1</p>");
  page = page.replace(/<h2 class="cs-title" id="cs-title">([\s\S]*?)<\/h2>/, '<h1 class="cs-title" id="cs-title">$1</h1>');

  await mkdir(`${OUT}/work/${p.slug}`, { recursive: true });
  await writeFile(`${OUT}/work/${p.slug}/index.html`, page);
}

// Sitemap
const today = new Date().toISOString().slice(0, 10);
const urls = [`${SITE}/`, ...projects.map((p) => `${SITE}/work/${p.slug}/`)];
await writeFile(`${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u, i) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><priority>${i ? "0.8" : "1.0"}</priority></url>`).join("\n") +
  `\n</urlset>\n`);

console.log(`Built ${OUT}/: homepage, ${projects.length} case studies, sitemap.xml`);
