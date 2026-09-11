# Usability Bug Investigation — SauceDemo (Assignment 2)

**Author:** Satyajeet Prakash
**Assignment:** AI-Assisted Bug Report Generator
**Site under test:** https://www.saucedemo.com
**Stack:** Playwright (TypeScript) · GitHub Actions

---

## 1. What this project is

The brief: explore a public website, note 2–3 usability issues as raw notes, use an AI
tool to turn those notes into proper bug reports, and automate a small validation script
for at least one of the bugs.

I tested SauceDemo's login screen on desktop (1440x900) and mobile (360x740) viewports.
Three issues survived my own verification — they're documented below with full evidence.
Two of the three are validated by automated checks in this repo; the third is logged as
manual-only with reasoning.

Everything an evaluator needs is here: the notes exactly as I wrote them, the prompt I
gave the AI tool, the structured reports it produced, and the scripts that re-verify
two of the bugs on every CI run.

## 2. Raw notes

Unedited notes from my exploration session (also in `docs/raw-notes.md`):

```javascript
Session: 2026-09-11, ~40 min, Chrome desktop + device toolbar
Site: saucedemo.com login page

- typed garbage user/pass on purpose -> red banner pops up. funny it says
  "Epic sadface". banner stays there forever?? no X to close it. have to either
  log in successfully or refresh the page. annoying.
- the red banner sits ON TOP of the login form, pushes everything down when it
  appears. on desktop fine but...
- tried phone size 360px -> the error text wraps weird, banner looks cramped.
  page itself seems to scroll sideways a little?? need to double check.
- password field: no eye icon to show what you typed. mistyped passwords happen
  all the time and you can't check. most sites have this now.
- after failed login the username stays filled in but password clears. mixed
  feelings - could argue either way, won't report.
- error icons inside the boxes - clicking the red X actually clears the field.
  nice, not a bug.
- keyboard tab order seems fine, fields are labelled ok-ish (placeholders only
  though? no real <label> elements. hmm maybe a11y but out of my depth to report
  properly)
```

## 3. The AI transformation

I pasted the notes into the tool with this prompt:

```javascript
You are a QA engineer. Here are my raw exploratory notes from testing the login
page of saucedemo.com. Turn each genuine usability issue into a structured bug
report with: ID, Title, Severity/Priority, Environment, Preconditions, Steps to
Reproduce, Expected Result, Actual Result. Flag anything in my notes that is NOT
worth reporting as a bug and say why. Do not invent issues I didn't observe.

<pasted notes>
```

Two things about that prompt matter to me: "do not invent issues" (I didn't want the
tool padding the list to look thorough) and "flag what is NOT worth reporting" — the
tool correctly talked me out of two notes:

- **Username retained after failed login** → the tool flagged this as intentional,
defensible UX, and reporting it would be noise. Agreed, dropped.
- **Placeholder-only inputs (no `<label>` elements)** → the tool said this is a real
accessibility concern but I hadn't verified it properly (I'd only eyeballed it), so
it should either be verified or left out. I verified — there ARE proper labels via
other attributes — and left it out.

That pushback saved me from reporting two weak bugs. Full reports are in
`docs/bug-reports.md`; the three that survived are summarized here.

## 4. Bug reports (summary)

### BUG-USA-001 — Error banner cannot be dismissed and persists until success or reload

- **Severity:** Medium · **Priority:** P2 · **Repro rate:** 5/5
- **Steps:** Trigger any login error → observe banner.
- **Expected:** Banner has a dismiss control, or auto-dismisses once the user corrects input.
- **Actual:** No close/dismiss element exists. Banner remains until a successful login
or page reload. Visually crowds the form on repeated failed attempts.
- **Automated validation:** `tests/usability-bugs.spec.ts › BUG-USA-001`

### BUG-USA-002 — No password visibility toggle on the password field

- **Severity:** Low · **Priority:** P3 · **Repro rate:** 5/5
- **Steps:** Focus the password field and type.
- **Expected:** A reveal/eye control lets the user verify input before submitting
(standard on most modern login forms).
- **Actual:** Password is masked with no way to reveal it. Typos are only discovered
after a failed login — which triggers BUG-USA-001.
- **Automated validation:** manual-only — asserting the *absence* of a feature is a
weak test that breaks the moment the site adds the toggle. Logged for manual regression.

### BUG-USA-003 — Horizontal page overflow at 360px viewport when error banner is shown

- **Severity:** High (mobile) · **Priority:** P1 · **Repro rate:** 5/5
- **Steps:** Set viewport to 360x740 → trigger a login error → attempt horizontal scroll.
- **Expected:** Content fits the viewport; no horizontal scrolling at any point.
- **Actual:** Page gains horizontal scroll when the banner is visible; the fixed header
plus the banner's layout causes content to extend past the viewport edge.
- **Automated validation:** `tests/usability-bugs.spec.ts › BUG-USA-003` — the script
fails the build if `scrollWidth > clientWidth` on `<html>`, so this bug can't
silently come back.

## 5. Automated validation

The validation spec (`tests/usability-bugs.spec.ts`) re-verifies both automatable bugs
and captures screenshot evidence into `evidence/` on failure. Assertions use exact DOM
conditions rather than screenshots alone (screenshots are supporting evidence, not the oracle).

```bash
npm install
npx playwright install --with-deps
npx playwright test
npx playwright show-report
```

## 6. Why I trust these reports

Every expected/actual pair was re-verified by script against the live DOM, each bug
reproduced 5/5 times, and the mobile overflow check runs in CI so regressions get
caught. Where automation would be a weak oracle (the missing eye toggle), I said so
instead of automating for the sake of it.

---

*Full raw notes: `docs/raw-notes.md` · Full structured reports: `docs/bug-reports.md`*
