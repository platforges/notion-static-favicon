/** Favicon URLs Notion itself uses for its default (non-page-specific) icon. */
export const NOTION_FAVICON_URLS: readonly string[] = [
  "https://www.notion.so/images/favicon.ico",
  "https://www.notion.so/front-static/favicon.ico",
];

const ICON_LINK_SELECTOR = "link[rel~='icon']";

const isIconLink = (node: Node): node is HTMLLinkElement =>
  node.nodeName === "LINK" &&
  (node as HTMLLinkElement).relList.contains("icon");

/**
 * Keeps the document's favicon pinned to `faviconUrl` (or one of Notion's
 * default favicons), undoing Notion's per-page favicon changes.
 *
 * Watches the active `<link rel="icon">` for `href` changes and `<head>` for
 * newly inserted icon links. Returns a function that stops watching.
 */
export function pinFavicon(doc: Document, faviconUrl: string): () => void {
  const allowed = new Set([faviconUrl, ...NOTION_FAVICON_URLS]);
  let current: HTMLLinkElement | null = null;

  const enforce = (link: HTMLLinkElement): void => {
    if (!allowed.has(link.href)) {
      link.href = faviconUrl;
    }
  };

  const hrefObserver = new MutationObserver(() => {
    if (current) enforce(current);
  });

  const track = (): void => {
    const link = doc.querySelector<HTMLLinkElement>(ICON_LINK_SELECTOR);
    if (!link || link === current) return;
    hrefObserver.disconnect();
    hrefObserver.observe(link, { attributeFilter: ["href"] });
    current = link;
    enforce(link);
  };

  const headObserver = new MutationObserver((mutations) => {
    if (mutations.some((m) => Array.from(m.addedNodes).some(isIconLink))) {
      track();
    }
  });
  headObserver.observe(doc.head, { childList: true });

  track();

  return () => {
    hrefObserver.disconnect();
    headObserver.disconnect();
  };
}
