(function () {
  "use strict";

  const root = document.documentElement;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Clock (Lagos, with seconds) ---------- */
  const clock = $("clock");
  function tick() {
    try {
      clock.textContent = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
    } catch (e) {}
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Theme ---------- */
  const themeBtn = $("theme-toggle");
  let animTimer;
  function syncThemeLabel() {
    const label = root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    themeBtn.setAttribute("aria-label", label);
    themeBtn.title = label;
  }
  themeBtn.addEventListener("click", () => {
    const t = root.dataset.theme === "dark" ? "light" : "dark";
    root.classList.add("theme-anim");
    root.dataset.theme = t;
    clearTimeout(animTimer);
    animTimer = setTimeout(() => root.classList.remove("theme-anim"), 400);
    try { localStorage.setItem("nuel-theme", t); } catch (e) {}
    syncThemeLabel();
  });
  syncThemeLabel();

  /* ---------- Intro "more about me" ---------- */
  const intro = $("intro");
  const introMore = $("intro-more");
  const introToggle = $("intro-toggle");
  introMore.inert = true;
  introToggle.addEventListener("click", () => {
    const open = !intro.classList.contains("is-open");
    intro.classList.toggle("is-open", open);
    introMore.inert = !open;
    introToggle.setAttribute("aria-expanded", String(open));
    introToggle.querySelector(".intro-toggle-label").textContent = open ? "show less" : "more about me";
  });

  /* ---------- Link previews (hover on intro links) ----------
     Screenshots come from Microlink at view time. Add data-preview-src="…"
     to a link to use a local image instead. */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const links = Array.from(document.querySelectorAll("a[data-preview]"));
    const card = document.createElement("div");
    card.className = "link-preview";
    card.setAttribute("aria-hidden", "true");
    card.innerHTML = '<div class="link-preview-shot"><img alt=""></div><div class="link-preview-host"><span></span><span>↗</span></div>';
    document.body.appendChild(card);
    const img = card.querySelector("img");
    const host = card.querySelector(".link-preview-host span");
    const cache = {};
    const CARD_W = 248, CARD_H = 196, GAP = 12;
    let hideTimer, visible = false;

    const shotSrc = (a) => a.dataset.previewSrc ||
      "https://api.microlink.io/?url=" + encodeURIComponent(a.href) +
      "&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800";
    function preload(a) {
      const src = shotSrc(a);
      if (!cache[src]) { cache[src] = new Image(); cache[src].src = src; }
      return cache[src];
    }

    function show(a, x, y) {
      clearTimeout(hideTimer);
      const pre = preload(a);
      if (img.getAttribute("src") !== pre.src) img.src = pre.src;
      card.classList.toggle("is-loading", !pre.complete);
      card.classList.toggle("is-error", pre.complete && !pre.naturalWidth);
      host.textContent = new URL(a.href).hostname.replace(/^www\./, "");

      // Anchor to the line of the link under the pointer (links can wrap).
      const rects = Array.from(a.getClientRects());
      const r = rects.find((q) => y >= q.top && y <= q.bottom) || rects[0];
      const cx = x ?? (r.left + r.width / 2);
      const left = Math.min(Math.max(cx - CARD_W / 2, 8), window.innerWidth - CARD_W - 8);
      const above = r.top - GAP - CARD_H >= 8;
      const top = above ? r.top - GAP - CARD_H : r.bottom + GAP;
      card.style.transformOrigin = (cx - left) + "px " + (above ? "100%" : "0%");
      if (!visible) { card.style.transition = "none"; }
      card.style.setProperty("--x", left + "px");
      card.style.setProperty("--y", top + "px");
      if (!visible) { void card.offsetWidth; card.style.transition = ""; }
      card.classList.add("is-visible");
      visible = true;
    }
    function hide() {
      hideTimer = setTimeout(() => { card.classList.remove("is-visible"); visible = false; }, 60);
    }

    img.addEventListener("load", () => card.classList.remove("is-loading", "is-error"));
    img.addEventListener("error", () => { card.classList.remove("is-loading"); card.classList.add("is-error"); });
    // Warm the cache as soon as the pointer comes near the intro.
    $("intro").addEventListener("pointerenter", () => links.forEach(preload), { once: true });
    links.forEach((a) => {
      a.addEventListener("pointerenter", (e) => show(a, e.clientX, e.clientY));
      a.addEventListener("pointermove", (e) => show(a, e.clientX, e.clientY));
      a.addEventListener("pointerleave", hide);
      a.addEventListener("focus", () => show(a));
      a.addEventListener("blur", hide);
    });
    window.addEventListener("scroll", () => { if (visible) { card.classList.remove("is-visible"); visible = false; } }, { passive: true });
  }

  /* ---------- Tabs ---------- */
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      let j = null;
      if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); selectTab(tabs[j], true); }
    });
  });

  /* ---------- Case study drawer ---------- */
  const page = $("page");
  const drawer = $("drawer");
  const scrim = $("scrim");
  const bar = $("drawer-bar");
  const scroller = $("drawer-scroll");
  const article = $("case-study");
  const label = $("drawer-label");
  const closeBtn = $("drawer-close");
  let PROJECTS = [];
  let total = "00";

  let active = 0;
  let isOpen = false;
  let returnFocus = null;

  // Content comes from the CMS, so any field may be missing or empty.
  const list = (v) => (Array.isArray(v) ? v.filter((x) => x !== "" && x != null) : []);
  const has = (v) => typeof v === "string" ? v.trim() !== "" : list(v).length > 0;

  function render(p, next) {
    const fact = (k, v) => has(v) ? `<div><span class="mono">${k}</span><span>${esc(v)}</span></div>` : "";
    const frame = (src, alt, lazy) => `<div class="frame"><img src="${esc(src)}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""}></div>`;
    const sections = list(p.sections);
    let n = 0;
    const num = () => String(++n).padStart(2, "0") + " — ";
    const entries = [["cs-overview", "project overview"]];
    const part = (id, label, html) => { entries.push([id, label]); return html; };

    label.textContent = `${p.n} / ${total} — ${p.name}`;
    article.innerHTML = `
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
    const nextBtn = $("next-case");
    if (nextBtn) nextBtn.addEventListener("click", goNext);

    mapList.innerHTML = entries.map(([id, t]) =>
      `<li><button type="button" data-target="${id}"><span class="tick" aria-hidden="true"></span>${esc(t)}</button></li>`).join("");
    mapButtons = Array.from(mapList.querySelectorAll("button"));
    mapTargets = entries.map(([id]) => $(id));
  }

  /* ---------- Case study map (sticky section nav) ---------- */
  const mapList = $("cs-map-list");
  const mapCount = $("cs-map-count");
  let mapButtons = [];
  let mapTargets = [];
  let spyFrame = 0;

  function spy() {
    spyFrame = 0;
    const top = scroller.getBoundingClientRect().top + 120;
    let current = 0;
    mapTargets.forEach((el, i) => { if (el.getBoundingClientRect().top <= top) current = i; });
    // At the very bottom the last short section may never reach the line.
    if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) current = mapTargets.length - 1;
    mapCount.textContent = String(current + 1).padStart(2, "0") + " / " + String(mapTargets.length).padStart(2, "0");
    mapButtons.forEach((b, i) => {
      if (i === current) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
  }
  scroller.addEventListener("scroll", () => { if (!spyFrame) spyFrame = requestAnimationFrame(spy); }, { passive: true });

  mapList.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-target]");
    if (!b) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $(b.dataset.target).scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });

  function show(i) {
    active = i;
    render(PROJECTS[i], PROJECTS[(i + 1) % PROJECTS.length]);
    scroller.scrollTop = 0;
    spy();
    try { history.replaceState(null, "", "#" + PROJECTS[i].slug); } catch (e) {}
  }

  function openAt(i) {
    returnFocus = document.activeElement;
    // Recede the page toward the centre of the current viewport.
    page.style.transformOrigin = "50% " + Math.round(window.scrollY + window.innerHeight / 2) + "px";
    show(i);
    setDrag(0);
    document.body.classList.add("locked");
    root.classList.add("drawer-open");
    isOpen = true;
    closeBtn.focus({ preventScroll: true });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    document.body.classList.remove("locked");
    root.classList.remove("drawer-open", "dragging");
    setDrag(0);
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    if (returnFocus && returnFocus.focus) returnFocus.focus({ preventScroll: true });
  }

  function goNext() {
    show((active + 1) % PROJECTS.length);
    closeBtn.focus({ preventScroll: true });
  }

  $("projects-list").addEventListener("click", (e) => {
    const card = e.target.closest("[data-project]");
    if (!card) return;
    e.preventDefault();
    const i = PROJECTS.findIndex((p) => p.slug === card.dataset.project);
    if (i >= 0) openAt(i);
  });
  closeBtn.addEventListener("click", close);
  scrim.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") close();
    // Keep keyboard focus inside the dialog.
    if (e.key === "Tab") {
      const f = drawer.querySelectorAll("button, a[href]");
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Drag the drawer's top bar to the right to dismiss. */
  let startX = 0, drag = 0, dragging = false;
  function setDrag(px) {
    drag = px;
    drawer.style.setProperty("--drag", px + "px");
    const fade = Math.max(0, 1 - px / 600);
    scrim.style.setProperty("--fade", fade);
    drawer.style.setProperty("--fade", fade);
  }
  bar.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    startX = e.clientX;
    dragging = true;
    bar.setPointerCapture && bar.setPointerCapture(e.pointerId);
    root.classList.add("dragging");
  });
  bar.addEventListener("pointermove", (e) => {
    if (dragging) setDrag(Math.max(0, e.clientX - startX));
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("dragging");
    if (drag > 120) close();
    else setDrag(0);
  }
  bar.addEventListener("pointerup", endDrag);
  bar.addEventListener("pointercancel", endDrag);

  /* ---------- Content (edited through the CMS, see content/ and .pages.yml) ---------- */
  function renderLists(site) {
    $("projects-list").innerHTML = PROJECTS.map((p) => `
      <a href="#${esc(p.slug)}" class="project" data-project="${esc(p.slug)}">
        <div class="shot">${has(p.cover || p.hero) ? `<img src="${esc(p.cover || p.hero)}" alt="${esc(p.name)}">` : ""}</div>
        <div class="project-meta">
          <span class="project-name">${esc(p.name)}</span>
          ${has(p.card_description) ? `<p class="project-desc">${esc(p.card_description)}</p>` : ""}
        </div>
      </a>`).join("");

    $("roles-list").innerHTML = list(site.experience).map((r) => `
      <div class="role">
        <span class="role-title"><span>${esc(r.role || "")}</span><span>${esc(r.company || "")}</span></span>
        <span class="mono">${esc(r.period || "")}</span>
      </div>`).join("");

    $("quotes-list").innerHTML = list(site.testimonials).map((q) => `
      <figure>
        <blockquote>“${esc(q.quote || "")}”</blockquote>
        <figcaption class="mono">${esc(q.name || "")}${has(q.title) ? " — " + esc(q.title) : ""}</figcaption>
      </figure>`).join("");

    $("playground-list").innerHTML = list(site.playground).filter((x) => has(x.image)).map((x) => `
      <div class="shot"><img src="${esc(x.image)}" alt="${esc(x.alt || "")}" loading="lazy"></div>`).join("");
  }

  const getJSON = (url) => fetch(url, { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error(url + " " + r.status);
    return r.json();
  });

  Promise.all([getJSON("content/case-studies.json"), getJSON("content/site.json")])
    .then(([cs, site]) => {
      PROJECTS = list(cs.case_studies).filter((p) => has(p.slug) && has(p.name))
        .map((p, i) => ({ ...p, n: String(i + 1).padStart(2, "0") }));
      total = String(PROJECTS.length).padStart(2, "0");
      renderLists(site);
      /* Deep link: /#fino opens that case study. */
      const initial = PROJECTS.findIndex((p) => p.slug === location.hash.slice(1));
      if (initial >= 0) setTimeout(() => openAt(initial), 80);
    })
    .catch((err) => {
      console.error("Could not load site content:", err);
      $("projects-list").innerHTML = '<p class="project-desc">Couldn’t load projects. Please refresh the page.</p>';
    });
})();
