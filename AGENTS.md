# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Prototype-specific direction

- Visual source of truth: `/Users/pasha/Library/Containers/ru.keepcoder.Telegram/Data/tmp/tav-import-4k.png`.
- Preserve the dark industrial art direction, orange accents, condensed headings, dense B2B landing-page rhythm, equipment imagery, lead form, selection cart, and consultant chat.
- Header and footer must remain reusable template components.
- The “Обсудим ваш проект” contact strip must match the corresponding reference section pixel-for-pixel on desktop, including its full-width left alignment, oversized orange contact icons, four fixed contact columns, and bespoke ImageGen-created industrial Eurasia route-map artwork on the right.
- The contact strip background must visually match the rendered left edge of the generated route-map artwork with no visible seam; use the asset's dominant left-edge source color `#000a13` as the baseline and prioritize the rendered match over a nominal sampled CSS value.
- Each of the six “Направления поставок” cards must open a dedicated clean-URL page with direction-specific content while retaining the shared header, footer, contact strip, lead form, selection cart, and consultant chat.
- Planned production stack: Node.js, PostgreSQL, Prisma, and amoCRM lead synchronization. The current stage is a frontend visual prototype with realistic local interactions only.
