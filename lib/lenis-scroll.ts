import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenisInstance(l: Lenis) {
  instance = l;
}

export function clearLenisInstance() {
  instance = null;
}

export function lenisScrollTo(href: string, offset = -80) {
  if (instance) {
    instance.scrollTo(href, { offset, duration: 1.4 });
  } else {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }
}
