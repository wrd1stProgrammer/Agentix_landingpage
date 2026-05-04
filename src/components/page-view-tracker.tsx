"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function PageViewTracker() {
  useEffect(() => {
    trackEvent("page_view", {
      path: window.location.pathname,
      search: window.location.search,
    });
  }, []);

  return null;
}
