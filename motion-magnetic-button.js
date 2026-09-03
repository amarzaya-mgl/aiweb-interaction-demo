/**
 * Magnetic Button — motion enhancement
 * Self-contained. Applies only to [data-motion-target~="magnetic-button"].
 * Delete this file + motion-magnetic-button.css + their <link>/<script> tags
 * in index.html to fully revert to the static design.
 */
(function () {
  "use strict";

  var MAX_OFFSET = 8;          // px, per axis
  var LABEL_RATIO = 0.4;       // label moves at 40% of button offset
  var PULL_STRENGTH = 0.35;    // fraction of distance-to-pointer applied as pull
  var INFLUENCE_PADDING = 48;  // px added around the button's own box
  var RETURN_MIN_MS = 420;
  var RETURN_MAX_MS = 520;

  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointerQuery = window.matchMedia("(pointer: fine)");

  if (reduceMotionQuery.matches || !finePointerQuery.matches) {
    return;
  }

  var targets = document.querySelectorAll('[data-motion-target~="magnetic-button"]');
  if (!targets.length) return;

  // Single overshoot ease: overshoots past 0 once, then settles — no repeated bounce.
  // Critically-damped-looking curve built from a decaying sine, capped to a single crossing.
  function overshootEase(t) {
    var decay = Math.exp(-6 * t);
    var wobble = Math.cos(7.2 * t);
    return 1 - decay * wobble;
  }

  targets.forEach(function (el) {
    // Wrap text content in a label span we can move independently (40% parallax).
    var label = el.querySelector(":scope > .magnetic-btn__label");
    if (!label) {
      label = document.createElement("span");
      label.className = "magnetic-btn__label";
      while (el.firstChild) {
        label.appendChild(el.firstChild);
      }
      el.appendChild(label);
    }

    var state = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      mode: "idle", // "idle" | "tracking" | "returning"
      rafId: null,
      returnStart: 0,
      returnDuration: 0,
      returnFromX: 0,
      returnFromY: 0
    };

    function applyTransform(x, y) {
      el.style.transform = "translate3d(" + x.toFixed(2) + "px, " + y.toFixed(2) + "px, 0)";
      label.style.transform = "translate3d(" + (x * LABEL_RATIO).toFixed(2) + "px, " + (y * LABEL_RATIO).toFixed(2) + "px, 0)";
    }

    function stopLoop() {
      if (state.rafId !== null) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
    }

    function trackingLoop() {
      if (state.mode !== "tracking") return;
      // Ease current position toward target for a smooth, non-jittery pull.
      state.x += (state.targetX - state.x) * 0.22;
      state.y += (state.targetY - state.y) * 0.22;
      applyTransform(state.x, state.y);
      state.rafId = requestAnimationFrame(trackingLoop);
    }

    function returnLoop(now) {
      if (state.mode !== "returning") return;
      var elapsed = now - state.returnStart;
      var t = Math.min(1, elapsed / state.returnDuration);
      var eased = overshootEase(t);

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
        el.style.transform = "";
        label.style.transform = "";
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

    function updateTargetFromPointer(clientX, clientY) {
      var rect = el.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;

      var dx = clientX - centerX;
      var dy = clientY - centerY;
      var influenceRadius = Math.max(rect.width, rect.height) / 2 + INFLUENCE_PADDING;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > influenceRadius) {
        if (state.mode === "tracking") beginReturn();
        return;
      }

      if (state.mode !== "tracking") {
        stopLoop();
        state.mode = "tracking";
        state.rafId = requestAnimationFrame(trackingLoop);
      }

      var pull = PULL_STRENGTH;
      state.targetX = clamp(dx * pull, -MAX_OFFSET, MAX_OFFSET);
      state.targetY = clamp(dy * pull, -MAX_OFFSET, MAX_OFFSET);
    }

    function onPointerLeaveWindow() {
      if (state.mode === "tracking") beginReturn();
    }

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      updateTargetFromPointer(e.clientX, e.clientY);
    }, { passive: true });

    document.addEventListener("pointerleave", onPointerLeaveWindow, { passive: true });
    el.addEventListener("pointercancel", function () {
      if (state.mode === "tracking") beginReturn();
    }, { passive: true });
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // If the user's OS motion preference changes mid-session, stop imposing motion.
  reduceMotionQuery.addEventListener("change", function (e) {
    if (e.matches) {
      document.querySelectorAll('[data-motion-target~="magnetic-button"]').forEach(function (el) {
        el.style.transform = "";
        var label = el.querySelector(".magnetic-btn__label");
        if (label) label.style.transform = "";
      });
    }
  });
})();
