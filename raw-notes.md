# Raw Exploratory Notes — SauceDemo Login Page

*These are my notes exactly as taken during the session. Messy on purpose —
this is what the AI tool received as input.*

---

Session: 2026-09-11, ~40 minutes
Tester: Satyajeet Prakash
Environments: Chrome desktop 1440x900 · Chrome device toolbar 360x740 (Pixel-ish)
Build: saucedemo.com (live), no version info available on site

## desktop pass

- typed garbage user/pass on purpose -> red banner pops up. funny it says
"Epic sadface". banner stays there forever?? no X to close it. have to either
log in successfully or refresh the page. annoying.
- the red banner sits ON TOP of the login form, pushes everything down when it
appears. on desktop fine but...
- password field: no eye icon to show what you typed. mistyped passwords happen
all the time and you can't check. most sites have this now.
- after failed login the username stays filled in but password clears. mixed
feelings - could argue either way, won't report.
- error icons inside the boxes - clicking the red X actually clears the field.
nice, not a bug.
- keyboard tab order seems fine, fields are labelled ok-ish (placeholders only
though? no real <label> elements. hmm maybe a11y but out of my depth to report
properly)

## mobile pass (360x740)

- tried phone size 360px -> the error text wraps weird, banner looks cramped.
- page itself seems to scroll sideways a little?? confirmed - with the banner
visible the page scrolls horizontally. devtools shows <html> wider than
viewport. 5/5 times. without the banner no sideways scroll. so it's the
banner+header combo.
- typing on the phone layout works ok, button is reachable, not reporting that.

## not bugs / decided against

- username staying filled after failed login - could be intentional UX, weak report
- "Epic sadface" tone - it's a demo site, that's branding not a bug
