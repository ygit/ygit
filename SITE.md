# Personal website

Static HTML, CSS, SVG, and a small optional navigation script. No build step or runtime dependencies.

## Local preview

Run `python3 -m http.server 8080 --bind 127.0.0.1` from this repository.

## Editing

- `index.html`: midnight portfolio, company experience, technical toolkit, and community summary.
- `styles.css`: shared dark palette; sticky desktop identity column and mobile single-column layout. Desktop content is capped at 1440px. The identity rail compacts below 850px height and scrolls naturally with the page at 650px height or below.
- `spotlight.js`: subtle pointer-following background glow. Disabled for touch/coarse pointers and reduced motion; hides on pointer exit, keyboard navigation, or loss of focus.
- `navigation.js`: progressive enhancement that highlights the visible homepage section. All links work without JavaScript.
- `assets/*.svg`: conceptual diagrams, not exact production architecture. `<picture>` selects vertical diagrams at widths up to 600px so labels stay readable on phones.
- `work/*/index.html`: five engineering case studies, including iOS/mobile SDKs.
- `about/`, `speaking/`, `writing/`: detailed career, community, talks, and draft engineering notes.
- `tests/test_site.py`: standard-library checks for routes, navigation targets, metadata, and image accessibility. Run `python3 -m unittest discover -s tests -v` and `node --test tests/*.test.cjs`.

Edit HTML directly. Keep canonical URLs and sitemap.xml aligned with new pages. README.md is the separate GitHub profile and has not been changed.

## Content scope

Personal contributions are distinguished from the larger platform and public product capabilities. The case studies contain no customer payloads, internal links, or invented impact metrics. CleverTap/WebEngage scope incorporates the owner’s SDK delivery, monitoring, and integration-support clarification. Detailed 100ms SDK ownership can be expanded further. Platform content was checked against the five repositories supplied by the owner. Dates are retained from the existing profile. The new writing remains draft copy for review.

CNAME and Wrangler configuration are retained. No deployment has been performed.
