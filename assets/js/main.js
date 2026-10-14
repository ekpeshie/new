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
  const total = String(PROJECTS.length).padStart(2, "0");

  let active = 0;
  let isOpen = false;
  let returnFocus = null;

  function render(p, next) {
    const fact = (k, v) => `<div><span class="mono">${k}</span><span>${esc(v)}</span></div>`;
    const frame = (src, alt, lazy) => `<div class="frame"><img src="${esc(src)}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""}></div>`;

    label.textContent = `${p.n} / ${total} — ${p.name}`;
    article.innerHTML = `
      <header class="cs-head" id="cs-overview">
        <span class="mono">Case study</span>
        <h2 class="cs-title" id="cs-title">${esc(p.name)} <span class="subtitle">${esc(p.tagline)}</span></h2>
        <p class="cs-summary">${esc(p.summary)}</p>
        <div class="cs-facts">
          ${fact("Year", p.year)}${fact("Role", p.role)}${fact("Scope", p.scope)}${fact("Platform", p.platform)}
        </div>
      </header>

      <div class="frame cs-hero"><img src="${esc(p.hero)}" alt="${esc(p.name)}"></div>

      <section id="cs-context">
        <span class="mono">01 — Context</span>
        ${p.context.map((t) => `<p class="text2">${esc(t)}</p>`).join("")}
        <blockquote class="brief"><span class="mono">The brief</span>${esc(p.challenge)}</blockquote>
      </section>

      <section id="cs-discovery">
        <span class="mono">02 — Discovery</span>
        <p class="text2">${esc(p.researchIntro)}</p>
        <div class="findings">
          ${p.research.map((r) => `
            <div class="finding">
              <span class="mono">${esc(r.m)}</span>
              <div class="finding-grid"><p>${esc(r.f)}</p><p>→ ${esc(r.d)}</p></div>
            </div>`).join("")}
        </div>
      </section>

      <section class="insight" id="cs-insight">
        <span class="mono">Core insight</span>
        <p class="insight-quote">“${esc(p.insight)}”</p>
        <span class="mono northstar">North star — ${esc(p.northstar)}</span>
      </section>

      <section class="principles" id="cs-principles">
        <span class="mono">03 — Principles</span>
        ${p.principles.map((pr) => `
          <div class="principle">
            <span class="mono">${pr.n}</span>
            <div><strong>${esc(pr.t)}</strong><span>${esc(pr.d)}</span></div>
          </div>`).join("")}
      </section>

      <section class="screens">
        <span class="mono">04 — Key screens &amp; decisions</span>
        ${p.sections.map((sec, i) => `
          <div class="screen" id="cs-screen-${i}">
            <h3>${esc(sec.title)}</h3>
            ${sec.body.map((t) => `<p class="text2">${esc(t)}</p>`).join("")}
            ${sec.hasDecisions ? `<div class="decisions">${sec.decisions.map((d) => `
              <div class="decision"><strong>${esc(d.d)}</strong><span>${esc(d.w)}</span></div>`).join("")}</div>` : ""}
            <div class="screen-images">${sec.images.map((src) => frame(src, sec.title, true)).join("")}</div>
          </div>`).join("")}
      </section>

      <section id="cs-reflection">
        <span class="mono">05 — Reflection</span>
        ${p.reflection.map((t) => `<p>${esc(t)}</p>`).join("")}
      </section>

      <button type="button" class="next" id="next-case">
        <div>
          <span class="mono">Next case study</span>
          <span class="next-name">${esc(next.name)} <span class="subtitle">${esc(next.tagline)}</span></span>
        </div>
        <span class="mono continue">Continue →</span>
      </button>`;
    $("next-case").addEventListener("click", goNext);

    const entries = [
      ["cs-overview", "project overview"],
      ["cs-context", "context"],
      ["cs-discovery", "discovery"],
      ["cs-insight", "core insight"],
      ["cs-principles", "principles"],
      ...p.sections.map((sec, i) => ["cs-screen-" + i, sec.title]),
      ["cs-reflection", "reflection"]
    ];
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
    try { history.replaceState(null, "", "#" + PROJECTS[i].id); } catch (e) {}
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

  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const i = PROJECTS.findIndex((p) => p.id === card.dataset.project);
      if (i >= 0) openAt(i);
    });
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

  /* Deep link: /#fino opens that case study. */
  const initial = PROJECTS.findIndex((p) => p.id === location.hash.slice(1));
  if (initial >= 0) setTimeout(() => openAt(initial), 80);
})();
