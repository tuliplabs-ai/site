// Progressive enhancement only: pages are fully visible and functional
// without this file. It adds a gentle reveal as sections scroll into view.
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var targets = [];
  document.querySelectorAll("main section").forEach(function (section) {
    section.querySelectorAll(":scope > .wrap > *, :scope > .wrap > .col > *").forEach(function (el) {
      targets.push(el);
    });
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );

  targets.forEach(function (el) {
    // Only pre-hide elements below the fold, so the first paint never flashes.
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add("pre-reveal");
    }
    observer.observe(el);
  });

  // Printing renders the whole page at once — reveal everything first.
  window.addEventListener("beforeprint", function () {
    targets.forEach(function (el) { el.classList.add("in-view"); });
  });
})();
