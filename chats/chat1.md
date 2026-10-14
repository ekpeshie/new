# Portfolio redesign project

_Started 2026-10-13 23:34 UTC_

---

## User

Help me redesign my portfolio. My current portfolio is https://nuelabu.framer.website. The wording of my portfolio should make me sound more senior level. 

I like https://www.ileri.xyz and also https://kadet.dev

Make the interactions such that the case studies open up like a drawer

## Assistant

_[tool: dc_write]_

_[tool: web_fetch]_

_[tool: web_fetch]_

_[tool: web_fetch]_

_[tool: web_fetch]_

_[tool: web_fetch]_

_[tool: web_fetch]_

_[tool: ready_for_verification]_

I've rebuilt your portfolio as a dark, minimal page in the style of your two references. It's with a checker for review now.

**How it works:**
- Clicking a project opens its case study in a drawer that slides up from the bottom while the page behind shrinks back slightly.
- You can close the drawer with Esc, the Close button, a click outside it, or by dragging it down. A "Next case study" link at the bottom moves you through the projects.
- You can switch the drawer to a side panel, and turn off the shrinking page behind it, from Tweaks.

**What I changed in the wording:**
- The new headline is "I design products where the rules are complicated and the stakes are real." The copy now talks about owning work end to end and working with founders on what to build.
- I rewrote each case study around research findings, the decisions they led to, a core insight, principles and a reflection.
- I trimmed the testimonials. In Bolaji's quote I removed a line that called you "Peace", which looked like a copy-paste slip.

**Please check:**
- **Location and availability:** The clock assumes Lagos, and the header says "Open to senior roles & select engagements". Change either if they're wrong.
- **Job titles:** I kept your actual titles. If you led design at Tinglemore or Fino, say so and I'll make the wording stronger.
- **Freelance line:** I described your freelance work as "Independent Product Designer · Fintech & health clients". That's my guess from the projects, so correct it if it's off.
- **Images:** These load straight from your current Framer site, so they'll break if those files are moved.

## User

The drawer should come from the right not from down. Also add option for light and dark modes using a moon and sun icon. The default mode should be light mode

You can use apple design skill to improve the site also

## Assistant

_[tool: run_script]_

_[tool: dc_set_props]_

_[tool: ready_for_verification]_

The case studies now slide in from the right, and the site opens in light mode. A moon/sun button in the header switches between light and dark, and the site remembers the visitor's choice.

There's no Apple design skill available to me, so I made Apple-style changes by hand:
- **Font:** the site now uses Apple's own system font. Visitors on Apple devices see that; everyone else still sees the original font, Geist.
- **Header:** it now stays at the top while you scroll, with a frosted-glass background.
- **Colours:** the light-mode greys are taken from Apple's palette.

To make room for the theme button, I removed "Words" from the header links; the testimonials section is still on the page. The bottom drawer is still available as an option in Tweaks. The changes are still being checked.

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I fixed the grey shadow that was showing on the right edge of the page. The drawer was sitting just off-screen while closed and its shadow was spilling into view, so I moved it further off-screen.

## User

The mobile responsiveness is quite bad. Some things are too small or too big. You can change the page arrangement for mobile screens

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I've reworked the layout for phones; it's being checked now.

- **Header:** on phones it shows just your name, "Book a call" and the theme button. The theme button is a little larger so it's easier to tap.
- **Text sizes and spacing:** headings, body text and the gaps between sections now shrink smoothly to fit the screen, so nothing is oversized on mobile.
- **Project cards:** each project's one-line description now sits under its name instead of wrapping beside it.
- **Experience:** the company now sits under each job title.
- **Explorations:** the three images become a row you swipe sideways on phones.
- **Case studies:** on phones they open full-screen, and the page behind doesn't shrink back. The spacing and the "Core insight" box inside them are tighter too.
- **Buttons:** made taller (44px) so they're easier to tap.

## User

I want my work section to be like this

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I've rebuilt the work section to match your screenshot; it's being checked now.

- **Tabs:** pill tabs (work, experience, words, tinkerings) at the top of the section. The selected tab is a dark pill, the others are grey text. Experience, testimonials and explorations now sit inside these tabs instead of being separate sections.
- **Project cards:** each screenshot sits inside a large light-grey panel with padding around it. Below it is the project name in lowercase with a dotted underline, then a one-line description in larger grey text.
- **Removed:** the year, tags and "Open case study" label from the cards. Clicking a card still opens its case study in the side drawer.
- **Header links:** "Work" and "Experience" in the header now jump to this section and open the matching tab.

Your direct edits to the hero text and headline are unchanged.

## User

I want smaller text sizes please like the one on https://www.ileri.xyz . Format my texts like on that site too

## Assistant

_[tool: run_script]_

_[tool: web_fetch]_

_[tool: ready_for_verification]_

I made the text smaller and switched the home page to the lowercase, casual style; it's being checked now. I couldn't load ileri.xyz to see its exact styling, so I matched it from your screenshot.

- **Sizes:** body text, project descriptions and testimonials are now 14px, project names 15px, and small labels 11px. The headline is now about 19px in regular weight instead of a large display size. Tabs and buttons are smaller too.
- **Formatting:** everything on the home page now displays in lowercase.
- **Case studies:** headings are scaled down and lowercase, but the long paragraphs keep normal capitals so they're easier to read.

Your headline currently has a typo with the ending cut off ("…lloyd's bank (kind of"). You'll want to finish that sentence.

## User

Then the time should also show seconds. Not just hour and minute. Can you give another name for tinkerings? Then also change words to testimonials or something. Rather than making the sections to be pill buttons, make the active state obvious

## Assistant

_[tool: run_script]_

Overlap the active underline with the tab row's divider:

_[tool: run_script]_

_[tool: ready_for_verification]_

I've made all four changes:

- **Clock:** now shows seconds and updates every second.
- **"tinkerings" is now "playground".** Other options if you prefer: explorations, side quests, sketches.
- **"words" is now "testimonials".**
- **Tabs:** they're plain text now, not pills. The selected tab is in dark text with a solid line under it; the others are grey.

The page shows one console error on load: the case study's main image briefly tries to load before it has its address. It sorts itself out once the page finishes loading, so visitors won't see a broken image.

## User

remove the long grey bar. Also current state text is not visible

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Both fixed:
- **Grey bar:** the long divider under the tabs is gone.
- **Selected tab:** its text is now dark and visible. It had been set to the background colour, left over from the pill style. The underline is still there.

## User

Not sure we need work and experience in the top nav bar anymore. I think we should replace it with download resume

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I replaced "work" and "experience" in the header with "download resume ↓". "book a call" is still there on wider screens. On phones it's hidden so the header fits, since the hero already has a call button.

The resume link doesn't go anywhere yet. Upload your resume PDF and I'll connect it.

## User

This is my resume file. Remove the behance link from the footer

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

"download resume ↓" in the header now downloads your PDF as `Emmanuel_Abu-Ekpeshie_Resume.pdf`, and I removed the Behance link from the footer.

