"use client";

import { useEffect, useRef } from "react";

const MAX_LAG_MS = 100;

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}

/** Attach to the fixed progress bar element; drives its scaleX from page scroll. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let targetProgress = 0;
    let displayedProgress = 0;
    let progressAtAnchor = 0;
    let targetSetAt = 0;
    let rafId: number | null = null;

    function computeTargetProgress() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return 0;
      const raw = window.scrollY / scrollableHeight;
      return Math.min(1, Math.max(0, raw));
    }

    function applyTransform(value: number) {
      bar!.style.transform = `scaleX(${value})`;
    }

    function tick() {
      rafId = null;
      const now = performance.now();
      const elapsed = Math.max(0, now - targetSetAt);
      if (elapsed >= MAX_LAG_MS) {
        displayedProgress = targetProgress;
      } else {
        const t = easeOutQuad(elapsed / MAX_LAG_MS);
        displayedProgress = progressAtAnchor + (targetProgress - progressAtAnchor) * t;
        displayedProgress = Math.min(1, Math.max(0, displayedProgress));
      }

      applyTransform(displayedProgress);

      if (displayedProgress !== targetProgress) {
        rafId = requestAnimationFrame(tick);
      }
    }

    function scheduleTick() {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    function update() {
      const next = computeTargetProgress();
      if (next === targetProgress) return;

      progressAtAnchor = displayedProgress;
      targetProgress = next;
      targetSetAt = performance.now();

      if (reduceMotionQuery.matches) {
        displayedProgress = targetProgress;
        applyTransform(displayedProgress);
        return;
      }

      scheduleTick();
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => update());
      resizeObserver.observe(document.documentElement);
      if (document.body) resizeObserver.observe(document.body);
    }

    function onImageLoad() {
      update();
    }
    const images = Array.from(document.querySelectorAll("img"));
    images.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onImageLoad, { passive: true });
    });

    function onReducedMotionChange() {
      displayedProgress = targetProgress;
      applyTransform(displayedProgress);
    }
    reduceMotionQuery.addEventListener("change", onReducedMotionChange);

    targetProgress = computeTargetProgress();
    displayedProgress = targetProgress;
    progressAtAnchor = targetProgress;
    targetSetAt = performance.now();
    applyTransform(displayedProgress);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resizeObserver?.disconnect();
      images.forEach((img) => img.removeEventListener("load", onImageLoad));
      reduceMotionQuery.removeEventListener("change", onReducedMotionChange);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
}
