(function () {
  "use strict";

  const root = document.documentElement;
  const $ = (id) => document.getElementById(id);

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

  const R = window.SiteRender;
  const HOME_TITLE = "Emmanuel Abu-Ekpeshie — Product Designer";
  const workPath = (p) => "/work/" + p.slug + "/";

  function render(p, next) {
    const r = R.caseStudy(p, next, total);
    label.textContent = r.label;
    article.innerHTML = r.html;
    const nextBtn = $("next-case");
    if (nextBtn) nextBtn.addEventListener("click", goNext);
    mapList.innerHTML = R.mapItems(r.entries);
    mapButtons = Array.from(mapList.querySelectorAll("button"));
    mapTargets = r.entries.map(([id]) => $(id));
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
    const p = PROJECTS[i];
    document.title = p.name + (R.has(p.tagline) ? " — " + p.tagline : "") + " · Emmanuel Abu-Ekpeshie";
    try { history.replaceState(null, "", workPath(p)); } catch (e) {}
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
    document.title = HOME_TITLE;
    try { history.replaceState(null, "", "/" + location.search); } catch (e) {}
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
    $("projects-list").innerHTML = R.projectCards(PROJECTS);
    $("roles-list").innerHTML = R.roles(site);
    $("quotes-list").innerHTML = R.quotes(site);
    $("playground-list").innerHTML = R.playground(site);
  }

  const getJSON = (url) => fetch(url, { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error(url + " " + r.status);
    return r.json();
  });

  Promise.all([getJSON("/content/case-studies.json"), getJSON("/content/site.json")])
    .then(([cs, site]) => {
      PROJECTS = R.projects(cs);
      total = String(PROJECTS.length).padStart(2, "0");
      renderLists(site);
      /* /work/fino/ (or the older /#fino) opens that case study. */
      const m = location.pathname.match(/^\/work\/([^/]+)\/?$/);
      const slug = m ? decodeURIComponent(m[1]) : location.hash.slice(1);
      const initial = PROJECTS.findIndex((p) => p.slug === slug);
      // Pre-rendered case study pages arrive with the drawer already open.
      if (initial >= 0) {
        if (root.classList.contains("drawer-open")) { isOpen = true; returnFocus = null; show(initial); setDrag(0); }
        else setTimeout(() => openAt(initial), 80);
      }
    })
    .catch((err) => {
      console.error("Could not load site content:", err);
      // Pre-rendered HTML is still there; only complain if the page is empty.
      if (!$("projects-list").children.length)
        $("projects-list").innerHTML = '<p class="project-desc">Couldn’t load projects. Please refresh the page.</p>';
    });
})();
