"use client";

import { useEffect, useRef } from "react";

const ACTIVE_CLASS = "is-spotlight-active";

// Cards register themselves here so a single set of window listeners
// (one per page) can track pointer position across every spotlight card.
const registry = new Set<HTMLElement>();
let listenersAttached = false;
let activeCard: HTMLElement | null = null;
let pendingClientX = 0;
let pendingClientY = 0;
let rafId: number | null = null;

function cardUnderPointer(clientX: number, clientY: number) {
  for (const card of registry) {
    const rect = card.getBoundingClientRect();
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      return card;
    }
  }
  return null;
}

function updateFrame() {
  rafId = null;
  const nextCard = cardUnderPointer(pendingClientX, pendingClientY);

  if (nextCard !== activeCard) {
    activeCard?.classList.remove(ACTIVE_CLASS);
    nextCard?.classList.add(ACTIVE_CLASS);
    activeCard = nextCard;
  }

  if (activeCard) {
    const rect = activeCard.getBoundingClientRect();
    const xPct = ((pendingClientX - rect.left) / rect.width) * 100;
    const yPct = ((pendingClientY - rect.top) / rect.height) * 100;
    activeCard.style.setProperty("--spot-x", `${xPct}%`);
    activeCard.style.setProperty("--spot-y", `${yPct}%`);
  }
}

function scheduleUpdate(clientX: number, clientY: number) {
  pendingClientX = clientX;
  pendingClientY = clientY;
  if (rafId === null) {
    rafId = requestAnimationFrame(updateFrame);
  }
}

function clearActive() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  activeCard?.classList.remove(ACTIVE_CLASS);
  activeCard = null;
}

function ensureListeners(reduceMotionQuery: MediaQueryList) {
  if (listenersAttached) return;
  listenersAttached = true;

  window.addEventListener(
    "pointermove",
    (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      scheduleUpdate(e.clientX, e.clientY);
    },
    { passive: true }
  );
  document.addEventListener("pointerleave", clearActive, { passive: true });
  window.addEventListener("blur", clearActive);
  reduceMotionQuery.addEventListener("change", (e) => {
    if (e.matches) clearActive();
  });
}

/** Attach to any card element to give it the cursor-tracking spotlight hover effect. */
export function useSpotlightHover<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    if (reduceMotionQuery.matches || !finePointerQuery.matches) return;

    registry.add(el);
    ensureListeners(reduceMotionQuery);

    return () => {
      registry.delete(el);
      if (activeCard === el) {
        el.classList.remove(ACTIVE_CLASS);
        activeCard = null;
      }
    };
  }, []);

  return ref;
}
