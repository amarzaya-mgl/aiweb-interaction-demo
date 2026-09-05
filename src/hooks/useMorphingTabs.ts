"use client";

import { useEffect, useRef } from "react";

/**
 * Attach to a `role="tablist"` container that has a `.tabs__indicator` element
 * and one or more `role="tab"` children. Handles click/keyboard tab selection
 * and animates the shared-layout indicator between tabs.
 */
export function useMorphingTabs<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const tablist = ref.current;
    if (!tablist) return;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const indicator = tablist.querySelector<HTMLElement>(".tabs__indicator");
    const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
    if (!indicator || !tabs.length) return;

    function selectedTab() {
      return tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
    }

    function moveIndicatorTo(tab: HTMLElement, animate: boolean) {
      const tablistRect = tablist!.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      const x = tabRect.left - tablistRect.left;
      const y = tabRect.top - tablistRect.top;
      const w = tabRect.width;
      const h = tabRect.height;

      if (!animate || reduceMotionQuery.matches) {
        indicator!.classList.remove("tabs__indicator--animating");
      } else {
        indicator!.classList.add("tabs__indicator--animating");
      }

      indicator!.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${w}, ${h})`;
    }

    function selectTab(nextTab: HTMLElement, opts: { force?: boolean; focus?: boolean; skipAnimation?: boolean } = {}) {
      const current = selectedTab();
      if (nextTab === current && !opts.force) return;

      tabs.forEach((t) => {
        const isSelected = t === nextTab;
        t.setAttribute("aria-selected", isSelected ? "true" : "false");
        t.tabIndex = isSelected ? 0 : -1;
      });

      const panelId = nextTab.getAttribute("aria-controls");
      if (panelId) {
        const panel = document.getElementById(panelId);
        if (panel) panel.setAttribute("aria-labelledby", nextTab.id);
      }

      moveIndicatorTo(nextTab, !opts.skipAnimation);
      if (opts.focus) nextTab.focus();
    }

    function onClick(this: HTMLElement) {
      selectTab(this);
    }

    function onKeydown(this: HTMLElement, e: KeyboardEvent) {
      const currentIndex = tabs.indexOf(this);
      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowRight":
        case "Right":
          nextIndex = (currentIndex + 1) % tabs.length;
          break;
        case "ArrowLeft":
        case "Left":
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      selectTab(tabs[nextIndex], { focus: true });
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", onClick);
      tab.addEventListener("keydown", onKeydown);
    });

    moveIndicatorTo(selectedTab(), false);

    let ro: ResizeObserver | null = null;
    function onResize() {
      moveIndicatorTo(selectedTab(), false);
    }
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(onResize);
      ro.observe(tablist!);
      tabs.forEach((t) => ro!.observe(t));
    } else {
      window.addEventListener("resize", onResize);
    }

    function onReducedMotionChange() {
      moveIndicatorTo(selectedTab(), false);
    }
    reduceMotionQuery.addEventListener("change", onReducedMotionChange);

    return () => {
      tabs.forEach((tab) => {
        tab.removeEventListener("click", onClick);
        tab.removeEventListener("keydown", onKeydown);
      });
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
      reduceMotionQuery.removeEventListener("change", onReducedMotionChange);
    };
  }, []);

  return ref;
}
