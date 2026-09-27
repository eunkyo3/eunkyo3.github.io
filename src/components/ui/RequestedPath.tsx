"use client";

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/**
 * GitHub Pages serves the same static 404.html for every unknown path,
 * so the path the visitor typed is only known in the browser.
 */
export function RequestedPath() {
  const path = useSyncExternalStore(
    noSubscribe,
    () => decodeURI(window.location.pathname),
    () => "/",
  );
  return <span className="break-all">{path}</span>;
}
