import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRouteMeta } from "@/seo/routes";
import { renderHeadTags } from "@/seo/head";

// Keeps <head> in sync on client-side navigation. On first load the
// prerendered HTML already contains the exact same tags.
export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(pathname);
    const html = renderHeadTags(meta);
    const head = document.head;

    head.querySelectorAll("[data-seo]").forEach((el) => el.remove());
    const template = document.createElement("template");
    template.innerHTML = html;
    // Scripts inserted via innerHTML don't execute; JSON-LD doesn't need to.
    head.append(...template.content.childNodes);
  }, [pathname]);

  return null;
}
