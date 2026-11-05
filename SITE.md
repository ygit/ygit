# Personal website

Static HTML, CSS, SVG, and a small optional navigation script. No build step or runtime dependencies.

## Local preview

Run `python3 -m http.server 8080 --bind 127.0.0.1` from this repository.

## Editing

- `index.html`: AI-first midnight portfolio, three flagship project areas, working approach, career history, toolkit, community, and hiring contact.
- `styles.css`: shared dark palette; sticky desktop identity column and mobile single-column layout. Desktop content is capped at 1440px. The identity rail compacts below 850px height and scrolls naturally with the page at 650px height or below.
- `spotlight.js`: subtle pointer-following background glow. Disabled for touch/coarse pointers and reduced motion; hides on pointer exit, keyboard navigation, or loss of focus.
- `navigation.js`: progressive enhancement that highlights the visible homepage section. All links work without JavaScript.
- `assets/*.svg`: conceptual diagrams, not exact production architecture. `<picture>` selects vertical diagrams at widths up to 600px so labels stay readable on phones.
- `work/*/index.html`: nine engineering case studies: six AI stories, shared decision logic, platform context, and iOS/mobile SDKs.
- `about/`, `speaking/`, `writing/`: detailed career, community, talks, and draft engineering notes.
- `tests/test_site.py`: standard-library checks for routes, navigation targets, metadata, and image accessibility. Run `python3 -m unittest discover -s tests -v` and `node --test tests/*.test.cjs`.

Edit HTML directly. Keep canonical URLs and sitemap.xml aligned with new pages. README.md is the separate GitHub profile and has not been changed.

## Content scope

Personal contributions are distinguished from the larger platform and public product capabilities. The case studies contain no customer payloads, internal links, or invented impact metrics. CleverTap/WebEngage scope incorporates the owner’s SDK delivery, monitoring, and integration-support clarification. Detailed 100ms SDK ownership can be expanded further. Platform content was checked against the five repositories supplied by the owner. Dates are retained from the existing profile. The new writing remains draft copy for review.

CNAME and Wrangler configuration are retained. No deployment has been performed.

## November 2026 content update

The six AI stories use the owner-supplied AI Engineering Fieldguide as the content source. Historical prompt measurements and offline replay counts retain their sample sizes and limitations; they do not claim production-wide improvement. The homepage leads with AI work and names the roles the owner is seeking. Contact uses the existing LinkedIn profile. No private implementation links, raw transcripts, customer identifiers, or invented business-impact numbers were added.

## AI engineering notes

The homepage includes 15 native HTML disclosures across agent architecture, voice AI, and applied AI. Introductory paragraphs and project connections stay visible; detailed explanations use keyboard-accessible `details`/`summary` elements and require no JavaScript. General design concepts and hypothetical examples are distinct from the shipped-contribution case studies. Relevant concepts link to primary documentation from Anthropic, LiveKit, OpenAI, and MCP. `writing/index.html` also links to the new section.

## Flagship project organization

The homepage and work index group the detailed stories under healthcare voice workflows, reliable extraction and decision systems, and agent evaluation tooling. These are connected areas of contribution within the 100ms platform, not claims of sole ownership of three separate products. The work index retains links to all nine case studies, including platform and SDK work. Every case study begins with an accessible definition-list summary of the problem, contribution, key decision, and outcome/evidence. Historical measurements retain their sample and verification limits.
