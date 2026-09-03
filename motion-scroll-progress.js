/**
 * Scroll Progress indicator — motion enhancement
 * Self-contained. Renders a single fixed bar at the top of the viewport
 * showing how far the page has been scrolled.
 * Delete this file + motion-scroll-progress.css + their <link>/<script> tags
 * in index.html to fully revert to the static design.
 */
(function () {
  "use strict";

  var MAX_LAG_MS = 100; // displayed value must catch up to target within this window

  function initScrollProgress() {
    // Idempotent: fully tear down any previous instance before creating a new one.
    if (window.__scrollProgressCleanup) {
      window.__scrollProgressCleanup();
      window.__scrollProgressCleanup = null;
    }

    var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    var bar = document.querySelector(".scroll-progress");
    var createdBar = false;
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "scroll-progress";
      bar.setAttribute("aria-hidden", "true");
      document.body.appendChild(bar);
      createdBar = true;
    }

    var targetProgress = 0;
    var displayedProgress = 0;
    // Wall-clock anchors for a time-bounded ease, independent of frame timing:
    // whatever the actual rAF cadence turns out to be, displayedProgress is
    // guaranteed to reach targetProgress by targetSetAt + MAX_LAG_MS.
    var progressAtAnchor = 0;
    var targetSetAt = 0;
    var rafId = null;

    function computeTargetProgress() {
      var scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return 0;
      var raw = window.scrollY / scrollableHeight;
      return Math.min(1, Math.max(0, raw));
    }

    function applyTransform(value) {
      bar.style.transform = "scaleX(" + value + ")";
    }

    function easeOutQuad(t) {
      return 1 - (1 - t) * (1 - t);
    }

    function tick() {
      rafId = null;

      // Use a fresh wall-clock read rather than the rAF callback's own
      // timestamp: that timestamp marks frame-start and can predate a
      // performance.now() taken in synchronous script (e.g. inside the
      // scroll handler that just set targetSetAt), which would otherwise
      // yield a negative elapsed on the very next frame.
      var now = performance.now();
      var elapsed = Math.max(0, now - targetSetAt);
      if (elapsed >= MAX_LAG_MS) {
        displayedProgress = targetProgress;
      } else {
        var t = easeOutQuad(elapsed / MAX_LAG_MS);
        displayedProgress =
          progressAtAnchor + (targetProgress - progressAtAnchor) * t;
        displayedProgress = Math.min(1, Math.max(0, displayedProgress));
      }

      applyTransform(displayedProgress);

      if (displayedProgress !== targetProgress) {
        rafId = requestAnimationFrame(tick);
      }
    }

    function scheduleTick() {
      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    }

    function update() {
      var next = computeTargetProgress();
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

    // --- Listeners -------------------------------------------------------
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    var resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(function () {
        update();
      });
      resizeObserver.observe(document.documentElement);
      if (document.body) resizeObserver.observe(document.body);
    }

    // Images loading after initial paint change document height too.
    function onImageLoad() {
      update();
    }
    var images = document.querySelectorAll("img");
    images.forEach(function (img) {
      if (!img.complete) {
        img.addEventListener("load", onImageLoad, { passive: true });
      }
    });

    function onReducedMotionChange() {
      // Snap immediately either way so behavior matches the new preference.
      displayedProgress = targetProgress;
      applyTransform(displayedProgress);
    }
    reduceMotionQuery.addEventListener("change", onReducedMotionChange);

    // --- Initial paint -----------------------------------------------------
    targetProgress = computeTargetProgress();
    displayedProgress = targetProgress;
    progressAtAnchor = targetProgress;
    targetSetAt = performance.now();
    applyTransform(displayedProgress);

    // --- Cleanup -------------------------------------------------------
    window.__scrollProgressCleanup = function () {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (resizeObserver) resizeObserver.disconnect();
      images.forEach(function (img) {
        img.removeEventListener("load", onImageLoad);
      });
      reduceMotionQuery.removeEventListener("change", onReducedMotionChange);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (createdBar && bar.parentNode) {
        bar.parentNode.removeChild(bar);
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollProgress);
  } else {
    initScrollProgress();
  }
})();
