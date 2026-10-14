// Shared HTML templates for site content. Used in the browser (window.SiteRender)
// and by scripts/build.mjs to pre-render pages for search engines.
(function (root) {
  "use strict";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Content comes from the CMS, so any field may be missing or empty.
  const list = (v) => (Array.isArray(v) ? v.filter((x) => x !== "" && x != null) : []);
  const has = (v) => typeof v === "string" ? v.trim() !== "" : list(v).length > 0;

  // Normalise the case-study list: drop incomplete entries, number the rest.
  function projects(data) {
    return list(data && data.case_studies).filter((p) => has(p.slug) && has(p.name))
      .map((p, i) => ({ ...p, n: String(i + 1).padStart(2, "0") }));
  }

  // Returns the drawer label, the article HTML and the section map entries.
  function caseStudy(p, next, total) {
    const fact = (k, v) => has(v) ? `<div><span class="mono">${k}</span><span>${esc(v)}</span></div>` : "";
    const frame = (src, alt, lazy) => `<div class="frame"><img src="${esc(src)}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""}></div>`;
    const sections = list(p.sections);
    let n = 0;
    const num = () => String(++n).padStart(2, "0") + " — ";
    const entries = [["cs-overview", "project overview"]];
    const part = (id, label, html) => { entries.push([id, label]); return html; };

    const html = `
      <header class="cs-head" id="cs-overview">
        <span class="mono">Case study</span>
        <h2 class="cs-title" id="cs-title">${esc(p.name)}${has(p.tagline) ? ` <span class="subtitle">${esc(p.tagline)}</span>` : ""}</h2>
        ${has(p.summary) ? `<p class="cs-summary">${esc(p.summary)}</p>` : ""}
        <div class="cs-facts">
          ${fact("Year", p.year)}${fact("Role", p.role)}${fact("Scope", p.scope)}${fact("Platform", p.platform)}
        </div>
      </header>

      ${has(p.hero) ? `<div class="frame cs-hero"><img src="${esc(p.hero)}" alt="${esc(p.name)}"></div>` : ""}

      ${has(p.context) || has(p.brief) ? part("cs-context", "context", `
      <section id="cs-context">
        <span class="mono">${num()}Context</span>
        ${list(p.context).map((t) => `<p class="text2">${esc(t)}</p>`).join("")}
        ${has(p.brief) ? `<blockquote class="brief"><span class="mono">The brief</span>${esc(p.brief)}</blockquote>` : ""}
      </section>`) : ""}

      ${has(p.discovery_intro) || has(p.research) ? part("cs-discovery", "discovery", `
      <section id="cs-discovery">
        <span class="mono">${num()}Discovery</span>
        ${has(p.discovery_intro) ? `<p class="text2">${esc(p.discovery_intro)}</p>` : ""}
        <div class="findings">
          ${list(p.research).map((r) => `
            <div class="finding">
              <span class="mono">${esc(r.method || "")}</span>
              <div class="finding-grid"><p>${esc(r.finding || "")}</p>${has(r.decision) ? `<p>→ ${esc(r.decision)}</p>` : ""}</div>
            </div>`).join("")}
        </div>
      </section>`) : ""}

      ${has(p.insight) ? part("cs-insight", "core insight", `
      <section class="insight" id="cs-insight">
        <span class="mono">Core insight</span>
        <p class="insight-quote">“${esc(p.insight)}”</p>
        ${has(p.north_star) ? `<span class="mono northstar">North star — ${esc(p.north_star)}</span>` : ""}
      </section>`) : ""}

      ${has(p.principles) ? part("cs-principles", "principles", `
      <section class="principles" id="cs-principles">
        <span class="mono">${num()}Principles</span>
        ${list(p.principles).map((pr, j) => `
          <div class="principle">
            <span class="mono">${String(j + 1).padStart(2, "0")}</span>
            <div><strong>${esc(pr.title || "")}</strong><span>${esc(pr.description || "")}</span></div>
          </div>`).join("")}
      </section>`) : ""}

      ${sections.length ? `
      <section class="screens">
        <span class="mono">${num()}Key screens &amp; decisions</span>
        ${sections.map((sec, i) => part("cs-screen-" + i, sec.title || "screen " + (i + 1), `
          <div class="screen" id="cs-screen-${i}">
            <h3>${esc(sec.title || "")}</h3>
            ${list(sec.body).map((t) => `<p class="text2">${esc(t)}</p>`).join("")}
            ${has(sec.decisions) ? `<div class="decisions">${list(sec.decisions).map((d) => `
              <div class="decision"><strong>${esc(d.decision || "")}</strong><span>${esc(d.why || "")}</span></div>`).join("")}</div>` : ""}
            <div class="screen-images">${list(sec.images).map((src) => frame(src, sec.title || p.name, true)).join("")}</div>
          </div>`)).join("")}
      </section>` : ""}

      ${has(p.reflection) ? part("cs-reflection", "reflection", `
      <section id="cs-reflection">
        <span class="mono">${num()}Reflection</span>
        ${list(p.reflection).map((t) => `<p>${esc(t)}</p>`).join("")}
      </section>`) : ""}

      ${next !== p ? `
      <button type="button" class="next" id="next-case">
        <div>
          <span class="mono">Next case study</span>
          <span class="next-name">${esc(next.name)}${has(next.tagline) ? ` <span class="subtitle">${esc(next.tagline)}</span>` : ""}</span>
        </div>
        <span class="mono continue">Continue →</span>
      </button>` : ""}`;
    const label = `${p.n} / ${total} — ${p.name}`;
    return { label, html, entries };
  }

  const mapItems = (entries) => entries.map(([id, t]) =>
    `<li><button type="button" data-target="${id}"><span class="tick" aria-hidden="true"></span>${esc(t)}</button></li>`).join("");

  const projectCards = (projects) => projects.map((p) => `
      <a href="/work/${esc(p.slug)}/" class="project" data-project="${esc(p.slug)}">
        <div class="shot">${has(p.cover || p.hero) ? `<img src="${esc(p.cover || p.hero)}" alt="${esc(p.name)}">` : ""}</div>
        <div class="project-meta">
          <span class="project-name">${esc(p.name)}</span>
          ${has(p.card_description) ? `<p class="project-desc">${esc(p.card_description)}</p>` : ""}
        </div>
      </a>`).join("");
  const roles = (site) => list(site.experience).map((r) => `
      <div class="role">
        <span class="role-title"><span>${esc(r.role || "")}</span><span>${esc(r.company || "")}</span></span>
        <span class="mono">${esc(r.period || "")}</span>
      </div>`).join("");
  const quotes = (site) => list(site.testimonials).map((q) => `
      <figure>
        <blockquote>“${esc(q.quote || "")}”</blockquote>
        <figcaption class="mono">${esc(q.name || "")}${has(q.title) ? " — " + esc(q.title) : ""}</figcaption>
      </figure>`).join("");
  const playground = (site) => list(site.playground).filter((x) => has(x.image)).map((x) => `
      <div class="shot"><img src="${esc(x.image)}" alt="${esc(x.alt || "")}" loading="lazy"></div>`).join("");

  const api = { esc, list, has, projects, caseStudy, mapItems, projectCards, roles, quotes, playground };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SiteRender = api;
})(typeof window !== "undefined" ? window : globalThis);
