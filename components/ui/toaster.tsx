"use client";

import { useEffect } from "react";
import { mountToaster } from "gooey-toast";

export function Toaster() {
  useEffect(() => {
    const handle = mountToaster({ position: "top-right" });
    return () => handle.unmount();
  }, []);

  return null;
}
