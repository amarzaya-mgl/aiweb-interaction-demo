/**
 * Morphing Tabs (shared-layout indicator) — motion enhancement
 * Self-contained. Applies only to [data-motion-target~="morphing-tabs-shared-layout"].
 * Delete this file + motion-morphing-tabs.css + their <link>/<script> tags
 * in index.html to fully revert to the static design.
 */
(function () {
  "use strict";

  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  var tablists = document.querySelectorAll(
    '[data-motion-target~="morphing-tabs-shared-layout"][role="tablist"]'
  );
  if (!tablists.length) return;

  tablists.forEach(setupTablist);

  function setupTablist(tablist) {
    var indicator = tablist.querySelector(".tabs__indicator");
    var tabs = Array.prototype.slice.call(
      tablist.querySelectorAll('[role="tab"]')
    );
    if (!indicator || !tabs.length) return;

    function selectedTab() {
      return (
        tabs.filter(function (t) {
          return t.getAttribute("aria-selected") === "true";
        })[0] || tabs[0]
      );
    }

    function moveIndicatorTo(tab, animate) {
      var tablistRect = tablist.getBoundingClientRect();
      var tabRect = tab.getBoundingClientRect();

      var x = tabRect.left - tablistRect.left;
      var y = tabRect.top - tablistRect.top;
      var w = tabRect.width;
      var h = tabRect.height;

      if (!animate || reduceMotionQuery.matches) {
        indicator.classList.remove("tabs__indicator--animating");
      } else {
        indicator.classList.add("tabs__indicator--animating");
      }

      indicator.style.transform =
        "translate3d(" + x + "px, " + y + "px, 0) scale(" + w + ", " + h + ")";
    }

    function selectTab(nextTab, opts) {
      opts = opts || {};
      var current = selectedTab();
      if (nextTab === current && !opts.force) return;

      tabs.forEach(function (t) {
        var isSelected = t === nextTab;
        t.setAttribute("aria-selected", isSelected ? "true" : "false");
        t.tabIndex = isSelected ? 0 : -1;
      });

      var panelId = nextTab.getAttribute("aria-controls");
      if (panelId) {
        var panel = document.getElementById(panelId);
        if (panel) {
          panel.setAttribute("aria-labelledby", nextTab.id);
        }
      }

      moveIndicatorTo(nextTab, !opts.skipAnimation);

      if (opts.focus) {
        nextTab.focus();
      }
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        selectTab(tab);
      });

      tab.addEventListener("keydown", function (e) {
        var currentIndex = tabs.indexOf(tab);
        var nextIndex = null;

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
      });
    });

    // Initial placement — no transition on first paint.
    moveIndicatorTo(selectedTab(), false);

    // Re-measure on resize/layout change (font load, viewport resize, etc.)
    if (typeof ResizeObserver !== "undefined") {
      var ro = new ResizeObserver(function () {
        moveIndicatorTo(selectedTab(), false);
      });
      ro.observe(tablist);
      tabs.forEach(function (t) {
        ro.observe(t);
      });
    } else {
      window.addEventListener("resize", function () {
        moveIndicatorTo(selectedTab(), false);
      });
    }

    reduceMotionQuery.addEventListener("change", function () {
      moveIndicatorTo(selectedTab(), false);
    });
  }
})();
