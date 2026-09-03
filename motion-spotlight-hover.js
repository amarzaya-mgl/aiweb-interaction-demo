/**
 * Spotlight Hover — motion enhancement
 * Self-contained. Applies only to [data-motion-target~="spotlight-hover"].
 * Delete this file + motion-spotlight-hover.css + their <link>/<script> tags
 * in index.html to fully revert to the static design.
 */
(function () {
  "use strict";

  var ACTIVE_CLASS = "is-spotlight-active";

  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointerQuery = window.matchMedia("(pointer: fine)");

  if (reduceMotionQuery.matches || !finePointerQuery.matches) {
    return;
  }

  var cards = Array.prototype.slice.call(
    document.querySelectorAll('[data-motion-target~="spotlight-hover"]')
  );
  if (!cards.length) return;

  var activeCard = null;
  var pendingClientX = 0;
  var pendingClientY = 0;
  var rafId = null;

  function cardUnderPointer(clientX, clientY) {
    for (var i = 0; i < cards.length; i++) {
      var rect = cards[i].getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return cards[i];
      }
    }
    return null;
  }

  function updateFrame() {
    rafId = null;

    var nextCard = cardUnderPointer(pendingClientX, pendingClientY);

    if (nextCard !== activeCard) {
      if (activeCard) {
        activeCard.classList.remove(ACTIVE_CLASS);
      }
      if (nextCard) {
        nextCard.classList.add(ACTIVE_CLASS);
      }
      activeCard = nextCard;
    }

    if (activeCard) {
      var rect = activeCard.getBoundingClientRect();
      var xPct = ((pendingClientX - rect.left) / rect.width) * 100;
      var yPct = ((pendingClientY - rect.top) / rect.height) * 100;
      activeCard.style.setProperty("--spot-x", xPct + "%");
      activeCard.style.setProperty("--spot-y", yPct + "%");
    }
  }

  function scheduleUpdate(clientX, clientY) {
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
    if (activeCard) {
      activeCard.classList.remove(ACTIVE_CLASS);
      activeCard = null;
    }
  }

  window.addEventListener(
    "pointermove",
    function (e) {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      scheduleUpdate(e.clientX, e.clientY);
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", clearActive, { passive: true });
  window.addEventListener("blur", clearActive);

  reduceMotionQuery.addEventListener("change", function (e) {
    if (e.matches) clearActive();
  });
})();
