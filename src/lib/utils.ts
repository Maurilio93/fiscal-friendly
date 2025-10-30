import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function gotoAreaOrLogin() {
  try {
    const r = await fetch("/api/auth/status");
    const j = await r.json();
    if (j?.auth === "user") window.location.href = "/area";
    else window.location.href = "/login";
  } catch {
    window.location.href = "/login";
  }
}