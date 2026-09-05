"use client";

import { useEffect, useRef } from "react";

const MAX_OFFSET = 8;
const LABEL_RATIO = 0.4;
const PULL_STRENGTH = 0.35;
const INFLUENCE_PADDING = 48;
const RETURN_MIN_MS = 420;
const RETURN_MAX_MS = 520;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function overshootEase(t: number) {
  const decay = Math.exp(-6 * t);
  const wobble = Math.cos(7.2 * t);
  return 1 - decay * wobble;
}

type Mode = "idle" | "tracking" | "returning";

/**
 * Attach to a button/link ref to get the magnetic-pull hover effect.
 * Wraps the element's text in an inner label span (40% parallax) automatically.
 */
export function useMagneticButton<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    if (reduceMotionQuery.matches || !finePointerQuery.matches) return;

    let label = el.querySelector<HTMLSpanElement>(":scope > .magnetic-btn__label");
    if (!label) {
      label = document.createElement("span");
      label.className = "magnetic-btn__label";
      label.style.display = "inline-block";
      label.style.willChange = "transform";
      while (el.firstChild) {
        label.appendChild(el.firstChild);
      }
      el.appendChild(label);
    }
    labelRef.current = label;
    el.style.willChange = "transform";

    const state = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      mode: "idle" as Mode,
      rafId: null as number | null,
      returnStart: 0,
      returnDuration: 0,
      returnFromX: 0,
      returnFromY: 0,
    };

    function applyTransform(x: number, y: number) {
      el!.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      label!.style.transform = `translate3d(${(x * LABEL_RATIO).toFixed(2)}px, ${(y * LABEL_RATIO).toFixed(2)}px, 0)`;
    }

    function stopLoop() {
      if (state.rafId !== null) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
    }

    function trackingLoop() {
      if (state.mode !== "tracking") return;
      state.x += (state.targetX - state.x) * 0.22;
      state.y += (state.targetY - state.y) * 0.22;
      applyTransform(state.x, state.y);
      state.rafId = requestAnimationFrame(trackingLoop);
    }

    function returnLoop(now: number) {
      if (state.mode !== "returning") return;
      const elapsed = now - state.returnStart;
      const t = Math.min(1, elapsed / state.returnDuration);
      const eased = overshootEase(t);

      state.x = state.returnFromX * (1 - eased);
      state.y = state.returnFromY * (1 - eased);
      applyTransform(state.x, state.y);

      if (t < 1) {
        state.rafId = requestAnimationFrame(returnLoop);
      } else {
        state.mode = "idle";
        state.x = 0;
        state.y = 0;
        state.rafId = null;
        el!.style.transform = "";
        label!.style.transform = "";
      }
    }

    function beginReturn() {
      stopLoop();
      state.mode = "returning";
      state.returnFromX = state.x;
      state.returnFromY = state.y;
      state.returnStart = performance.now();
      state.returnDuration = RETURN_MIN_MS + Math.random() * (RETURN_MAX_MS - RETURN_MIN_MS);
      state.rafId = requestAnimationFrame(returnLoop);
    }

    function updateTargetFromPointer(clientX: number, clientY: number) {
      const rect = el!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const influenceRadius = Math.max(rect.width, rect.height) / 2 + INFLUENCE_PADDING;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > influenceRadius) {
        if (state.mode === "tracking") beginReturn();
        return;
      }

      if (state.mode !== "tracking") {
        stopLoop();
        state.mode = "tracking";
        state.rafId = requestAnimationFrame(trackingLoop);
      }

      state.targetX = clamp(dx * PULL_STRENGTH, -MAX_OFFSET, MAX_OFFSET);
      state.targetY = clamp(dy * PULL_STRENGTH, -MAX_OFFSET, MAX_OFFSET);
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      updateTargetFromPointer(e.clientX, e.clientY);
    }

    function onPointerLeaveWindow() {
      if (state.mode === "tracking") beginReturn();
    }

    function onPointerCancel() {
      if (state.mode === "tracking") beginReturn();
    }

    function onReducedMotionChange(e: MediaQueryListEvent) {
      if (e.matches) {
        el!.style.transform = "";
        if (label) label.style.transform = "";
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeaveWindow, { passive: true });
    el.addEventListener("pointercancel", onPointerCancel, { passive: true });
    reduceMotionQuery.addEventListener("change", onReducedMotionChange);

    return () => {
      stopLoop();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeaveWindow);
      el.removeEventListener("pointercancel", onPointerCancel);
      reduceMotionQuery.removeEventListener("change", onReducedMotionChange);
      el.style.transform = "";
      if (label) label.style.transform = "";
    };
  }, []);

  return ref;
}
