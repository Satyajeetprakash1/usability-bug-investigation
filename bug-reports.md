# Bug Reports — SauceDemo Login Page

*Structured reports produced by the AI tool from my raw notes, then verified
and corrected by me against the live site. Corrections are marked inline.*

---

## BUG-USA-001 — Error banner cannot be dismissed and persists until success or reload

| Field | Value |
| --- | --- |
| **Severity / Priority** | Medium / P2 |
| **Environment** | Chrome (desktop & mobile), saucedemo.com live build |
| **Repro rate** | 5/5 |
| **Component** | Login — error handling |

**Preconditions:** None. Any user on the login page.

**Steps to Reproduce:**

1. Open https://www.saucedemo.com
2. Enter any invalid username/password (e.g. `x` / `x`)
3. Click Login — error banner appears
4. Look for a dismiss/close control on the banner
5. Click elsewhere on the page; banner remains
6. Reload page — banner disappears

**Expected Result:** The banner offers a dismiss control, or auto-clears once the
user starts correcting their input. Persistent blocking UI without an escape is
a usability defect.

**Actual Result:** No dismiss control exists in the banner's DOM. The banner stays
visible through clicks elsewhere and only clears on a successful login or a page
reload. *(Corrected after AI draft: the tool claimed the banner "may auto-clear on
input" — it does not for re-typed invalid credentials; verified manually.)*

**Supporting evidence:** automated check `BUG-USA-001` in `tests/usability-bugs.spec.ts`;
screenshot captured on failure by the runner.

---

## BUG-USA-002 — No password visibility toggle on the password field

| Field | Value |
| --- | --- |
| **Severity / Priority** | Low / P3 |
| **Environment** | Chrome desktop, saucedemo.com |
| **Repro rate** | 5/5 |
| **Component** | Login — password input |

**Preconditions:** None.

**Steps to Reproduce:**

1. Open the login page
2. Type into the Password field
3. Attempt to reveal the typed characters

**Expected Result:** A reveal/eye toggle lets the user verify input before
submitting. Standard on modern login forms; mistyped passwords are a top cause of
failed logins — which on this site also triggers BUG-USA-001.

**Actual Result:** Input is permanently masked. No toggle exists in the DOM.

**Disposition:** *manual regression only.* A UI test asserting "element X does not
exist" is a weak oracle — it passes today and breaks (noisily) the day the feature
ships. Documented here rather than automated.

---

## BUG-USA-003 — Horizontal page overflow at 360px viewport when error banner is shown

| Field | Value |
| --- | --- |
| **Severity / Priority** | High (mobile) / P1 |
| **Environment** | 360x740 viewport (Chrome device toolbar), saucedemo.com |
| **Repro rate** | 5/5 |
| **Component** | Login — responsive layout |

**Preconditions:** Viewport width of 360px (or similar small-screen emulation).

**Steps to Reproduce:**

1. Open the login page at 360x740
2. Confirm no horizontal scroll before any error
3. Trigger any login error (invalid credentials → Login)
4. Attempt to scroll horizontally / inspect `<html>` dimensions

**Expected Result:** No horizontal scrolling at any point; all content fits the
viewport width.

**Actual Result:** With the banner visible, `document.documentElement.scrollWidth`
exceeds `clientWidth` — the page scrolls sideways. Without the banner, it does not.
Root cause appears to be the fixed header plus the banner layout at narrow widths.
*(Added after my manual verification — the AI tool had flagged mobile banner
"cramped" from my notes but I confirmed the actual overflow behavior in DevTools
before elevating severity to High.)*

**Supporting evidence:** automated check `BUG-USA-003` in `tests/usability-bugs.spec.ts`
asserts `scrollWidth <= clientWidth`, so a fix can be verified and a regression
caught in CI.
