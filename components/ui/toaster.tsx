"use client";

import { useEffect } from "react";
import { mountToaster } from "gooey-toast";

export function Toaster() {
  useEffect(() => {
    const handle = mountToaster({ position: "top-center" });
    return () => handle.unmount();
  }, []);

  return null;
}
