/* eslint-disable react-refresh/only-export-components -- build-only entry, not a HMR module */
// Build-time render entry used by scripts/prerender.mjs.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import Root from "./Root.jsx";
import { publicRoutes, getRouteMeta, notFoundMeta } from "./seo/routes";
import { renderHeadTags } from "./seo/head";

export { publicRoutes, notFoundMeta };
export { SITE_URL, CONTENT_UPDATED } from "./seo/config";

export function render(url) {
  const html = renderToString(
    <StaticRouter location={url}>
      <Root />
    </StaticRouter>,
  );
  const meta = url === "/404" ? notFoundMeta : getRouteMeta(url);
  return { html, head: renderHeadTags(meta) };
}

export function renderHead(meta) {
  return renderHeadTags(meta);
}
