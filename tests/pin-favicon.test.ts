import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NOTION_FAVICON_URLS, pinFavicon } from "../src/pin-favicon";

const BUNDLED = "chrome-extension://abcdefghijklmnop/base-favicon.ico";
const PAGE_ICON = "https://www.notion.so/image/emoji-rocket.png";

/** MutationObserver callbacks run as microtasks; let them (and any follow-ups) flush. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const addIconLink = (href: string): HTMLLinkElement => {
  const link = document.createElement("link");
  link.rel = "shortcut icon";
  link.href = href;
  document.head.append(link);
  return link;
};

describe("pinFavicon", () => {
  let stop: (() => void) | undefined;

  beforeEach(() => {
    document.head.innerHTML = "";
  });

  afterEach(() => {
    stop?.();
    stop = undefined;
  });

  it("replaces a page-specific favicon on start", () => {
    const link = addIconLink(PAGE_ICON);
    stop = pinFavicon(document, BUNDLED);
    expect(link.href).toBe(BUNDLED);
  });

  it.each(NOTION_FAVICON_URLS)(
    "leaves Notion's default favicon %s alone",
    (url) => {
      const link = addIconLink(url);
      stop = pinFavicon(document, BUNDLED);
      expect(link.href).toBe(url);
    },
  );

  it("resets the favicon when Notion later changes its href", async () => {
    const link = addIconLink(BUNDLED);
    stop = pinFavicon(document, BUNDLED);

    link.href = PAGE_ICON;
    await flush();

    expect(link.href).toBe(BUNDLED);
  });

  it("tracks a replacement icon link inserted into <head>", async () => {
    const original = addIconLink(BUNDLED);
    stop = pinFavicon(document, BUNDLED);

    original.remove();
    const replacement = addIconLink(PAGE_ICON);
    await flush();
    expect(replacement.href).toBe(BUNDLED);

    replacement.href = PAGE_ICON;
    await flush();
    expect(replacement.href).toBe(BUNDLED);
  });

  it("does not loop after resetting the favicon", async () => {
    const link = addIconLink(BUNDLED);
    stop = pinFavicon(document, BUNDLED);

    let hrefMutations = 0;
    const counter = new MutationObserver((records) => {
      hrefMutations += records.length;
    });
    counter.observe(link, { attributeFilter: ["href"] });

    link.href = PAGE_ICON;
    await flush();
    await flush();
    counter.disconnect();

    // One change from "Notion", one reset from us, nothing more.
    expect(hrefMutations).toBe(2);
    expect(link.href).toBe(BUNDLED);
  });

  it("ignores non-icon links", async () => {
    stop = pinFavicon(document, BUNDLED);
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "https://www.notion.so/app.css";
    document.head.append(stylesheet);
    await flush();
    expect(stylesheet.href).toBe("https://www.notion.so/app.css");
  });
});
