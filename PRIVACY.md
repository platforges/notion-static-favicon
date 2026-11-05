# Privacy Policy

**Notion Static Favicon** (Chrome extension)

Effective date: November 5, 2026

## Summary

Notion Static Favicon does not collect, store, transmit, sell, or share any personal or sensitive
user data.

## What the extension does

The extension runs a content script only on Notion pages (`notion.so`, `www.notion.so`,
`notion.com`, `www.notion.com`, `app.notion.com`). The script watches the page's
`<link rel="icon">` element and, when Notion changes it to a page-specific icon, sets it back to
the standard Notion favicon bundled with the extension.

## Data collection

The extension does not collect any data. Specifically, it does **not**:

- read, store, or transmit the content of your Notion pages;
- collect personally identifiable information, authentication information, browsing history,
  location, or any other user activity;
- use cookies, local storage, `chrome.storage`, or any other storage mechanism;
- make any network requests, or send data to the developer or any third party;
- use analytics, tracking, or advertising.

The only part of the page the extension reads or changes is the favicon `<link>` element's `href`
attribute. All processing happens locally in your browser.

## Permissions

The extension requests no Chrome permissions. It declares a content script limited to the Notion
domains listed above, and exposes its bundled favicon file to those pages so the browser can display
it.

## Third parties

No data is shared with third parties, because no data is collected.

## Changes to this policy

If this policy changes, the updated version will be published at this same location with a new
effective date. The full history of changes is available in this repository's commit history.

## Contact

Questions about this policy can be raised by opening an issue at
<https://github.com/platforges/notion-static-favicon/issues>.
