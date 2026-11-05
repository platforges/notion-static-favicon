# Notion Static Favicon

[![CI](https://github.com/platforges/notion-static-favicon/actions/workflows/ci.yml/badge.svg)](https://github.com/platforges/notion-static-favicon/actions/workflows/ci.yml)

Chrome extension that prevents Notion's favicon from changing to match the current page. Once it's
installed, the tab icon always stays the Notion logo, which makes the tab easier to find when you
have a lot of other things open.

To temporarily restore the default behavior, disable the extension and refresh the Notion page.

## Installation

Install it from the Chrome Web Store: coming soon (see [#1][cws-issue]).

Or load it unpacked: run `npm ci && npm run build`, open `chrome://extensions`, enable
**Developer mode**, click **Load unpacked**, and select the `dist/extension/` folder.

## Development

Requires Node 26 (see `.nvmrc`). Every build and test step is an npm script, and CI runs the same
scripts.

| Command               | What it does                                                                  |
| --------------------- | ----------------------------------------------------------------------------- |
| `npm run build`       | Bundle `src/` with esbuild into `dist/extension/` (version from package.json) |
| `npm run watch`       | Rebuild on change                                                             |
| `npm run typecheck`   | `tsc --noEmit`                                                                |
| `npm run lint`        | ESLint + Prettier check (`npm run format` to fix)                             |
| `npm test`            | Vitest unit tests (jsdom)                                                     |
| `npm run check`       | All of the above; this is what CI runs                                        |
| `npm run zip`         | Build and pack `dist/notion-static-favicon-<version>.zip`                     |
| `npm run publish:cws` | Upload and publish the zip to the Chrome Web Store (see [#1][cws-issue])      |

Layout: `src/pin-favicon.ts` holds the logic, `src/content.ts` is the content-script entry,
`src/manifest.json` is the manifest template, and `public/` has static files copied into `dist/extension/`
as-is (the bundled favicon and the extension icons). The 512px icon master is in `assets/`.

## Privacy

The extension collects no data. See [PRIVACY.md](PRIVACY.md).

## Credits

Forked from [leothorp/notion-favicon-fixer](https://github.com/leothorp/notion-favicon-fixer).

[cws-issue]: https://github.com/platforges/notion-static-favicon/issues/1
