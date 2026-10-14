// Downloads every image still hosted on Framer into assets/uploads/ and
// rewrites the content files to point at the local copies.
// Run once from the repo root with Node 18+:  node scripts/localize-images.mjs
import { readFile, writeFile, mkdir, access } from "node:fs/promises";

const FILES = ["content/case-studies.json", "content/site.json"];
const DIR = "assets/uploads";
const FRAMER = /https:\/\/framerusercontent\.com\/images\/([A-Za-z0-9]+)\.(png|jpe?g|webp|gif)/g;

await mkdir(DIR, { recursive: true });
const exists = (p) => access(p).then(() => true, () => false);
let failed = 0;

for (const file of FILES) {
  let text = await readFile(file, "utf8");
  const urls = [...new Set([...text.matchAll(FRAMER)].map((m) => m[0]))];
  for (const url of urls) {
    const name = url.split("/").pop();
    const dest = `${DIR}/${name}`;
    if (!(await exists(dest))) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      } catch (err) {
        console.error(`✗ ${url} (${err.cause?.code || err.message})`);
        failed++;
        continue;
      }
      console.log(`✓ ${dest}`);
    }
    text = text.split(url).join(`/${dest}`);
  }
  await writeFile(file, text);
}
console.log(failed ? `${failed} image(s) failed; run again to retry.` : "All images are local.");
