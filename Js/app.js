/**
 * Taha Alsheikh Taha — portfolio behaviour.
 *
 * Everything here is progressive enhancement: the page is complete and usable
 * with JavaScript disabled. This file only adds convenience — theme switching,
 * filtering, scroll-spy and reveal animations.
 *
 * No dependencies.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ----------------------------------------------------------------------
   * Small helpers
   * -------------------------------------------------------------------- */

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call(
      (scope || document).querySelectorAll(selector)
    );
  }

  /** Read/write localStorage without ever throwing (private mode, blocked storage). */
  var store = {
    get: function (key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        /* ignore — the feature still works for this page view */
      }
    },
  };

  /* ----------------------------------------------------------------------
   * Theme toggle
   * The initial theme is applied by an inline script in <head> so the page
   * never flashes the wrong colours. This only handles switching.
   * -------------------------------------------------------------------- */

  (function initTheme() {
    var toggle = $("#theme-toggle");
    if (!toggle) return;

    var icon = $("[data-theme-icon] use", toggle);

    function currentTheme() {
      return root.getAttribute("data-theme") === "light" ? "light" : "dark";
    }

    function render() {
      var isLight = currentTheme() === "light";
      if (icon) icon.setAttribute("href", isLight ? "#i-moon" : "#i-sun");
      toggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );
      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", isLight ? "#f6f7f9" : "#0a0b0e");
    }

    toggle.addEventListener("click", function () {
      var next = currentTheme() === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      store.set("theme", next);
      render();
    });

    render();
  })();

  /* ----------------------------------------------------------------------
   * Mobile navigation
   * -------------------------------------------------------------------- */

  (function initNav() {
    var toggle = $("#nav-toggle");
    var menu = $("#nav-menu");
    if (!toggle || !menu) return;

    var icon = $("[data-menu-icon] use", toggle);

    function setOpen(open) {
      menu.setAttribute("data-open", open ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (icon) icon.setAttribute("href", open ? "#i-close" : "#i-menu");
    }

    function isOpen() {
      return toggle.getAttribute("aria-expanded") === "true";
    }

    setOpen(false);

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    // Close after choosing a destination.
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!isOpen()) return;
      if (!event.target.closest(".nav")) setOpen(false);
    });

    // A resize past the breakpoint leaves the desktop nav visible anyway;
    // reset the state so the button is consistent when it comes back.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 800 && isOpen()) setOpen(false);
    });
  })();

  /* ----------------------------------------------------------------------
   * Project filtering
   * -------------------------------------------------------------------- */

  (function initFilters() {
    var buttons = $$(".filter");
    var projects = $$("#projects-grid .project");
    var empty = $("#projects-empty");
    var status = $("#filter-status");
    if (!buttons.length || !projects.length) return;

    function apply(filter) {
      var shown = 0;

      projects.forEach(function (project) {
        var match = filter === "all" || project.dataset.type === filter;
        project.hidden = !match;
        if (match) shown++;
      });

      buttons.forEach(function (button) {
        button.setAttribute(
          "aria-pressed",
          button.dataset.filter === filter ? "true" : "false"
        );
      });

      if (empty) empty.hidden = shown > 0;
      if (status) {
        status.textContent =
          shown + (shown === 1 ? " project shown" : " projects shown");
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        apply(button.dataset.filter);
      });
    });

    // Keep the counts in the buttons honest even if projects are added later.
    buttons.forEach(function (button) {
      var count = button.querySelector(".filter__count");
      if (!count) return;
      var filter = button.dataset.filter;
      count.textContent =
        filter === "all"
          ? projects.length
          : projects.filter(function (p) {
              return p.dataset.type === filter;
            }).length;
    });

    apply("all");
  })();

  /* ----------------------------------------------------------------------
   * Front-end gallery: collapse to the first row until asked
   * -------------------------------------------------------------------- */

  (function initGallery() {
    var button = $("#gallery-more");
    var extras = $$("#gallery [data-extra]");
    if (!button || !extras.length) return;

    var expanded = false;
    var total = $$("#gallery .gallery__item").length;

    function render() {
      extras.forEach(function (item) {
        item.hidden = !expanded;
      });
      button.textContent = expanded ? "Show less" : "Show all " + total;
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
    }

    button.setAttribute("aria-controls", "gallery");

    button.addEventListener("click", function () {
      expanded = !expanded;
      render();
      if (!expanded) {
        button.scrollIntoView({
          block: "center",
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    });

    render();
  })();

  /* ----------------------------------------------------------------------
   * Scroll-spy: highlight the nav link for the section in view
   * -------------------------------------------------------------------- */

  (function initScrollSpy() {
    if (!("IntersectionObserver" in window)) return;

    var links = $$(".nav__link");
    var map = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      map[id] = link;
      sections.push(section);
    });

    if (!sections.length) return;

    var visible = new Set();

    function highlight() {
      // Pick the topmost visible section so a tall section wins over a sliver.
      var best = null;
      sections.forEach(function (section) {
        if (!visible.has(section.id)) return;
        if (!best || section.offsetTop < best.offsetTop) best = section;
      });

      links.forEach(function (link) {
        link.removeAttribute("aria-current");
      });
      if (best && map[best.id]) map[best.id].setAttribute("aria-current", "true");
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        highlight();
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  })();

  /* ----------------------------------------------------------------------
   * Reveal on scroll
   * -------------------------------------------------------------------- */

  (function initReveal() {
    var items = $$("[data-reveal]");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    items.forEach(function (item, index) {
      // A short stagger inside each group reads as one motion rather than a pop.
      item.style.transitionDelay = (index % 4) * 70 + "ms";
      observer.observe(item);
    });
  })();

  /* ----------------------------------------------------------------------
   * Header state + back-to-top (one scroll listener, rAF-throttled)
   * -------------------------------------------------------------------- */

  (function initScrollUi() {
    var header = $("#site-header");
    var toTop = $("#to-top");
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle("is-scrolled", y > 12);
      if (toTop) toTop.classList.toggle("is-visible", y > 600);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
        var brand = $(".nav__brand");
        if (brand) brand.focus({ preventScroll: true });
      });
    }

    update();
  })();

  /* ----------------------------------------------------------------------
   * Footer year
   * -------------------------------------------------------------------- */

  (function initYear() {
    var year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  })();
})();
