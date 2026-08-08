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

// Interactive architecture inspector (platform.html only). Progressive
// enhancement: without JS the page shows the diagram plus a pre-rendered
// inspector card for the Gateway; with JS every node becomes selectable.
(function () {
  var stage = document.querySelector(".stage");
  if (!stage) return;

  var NODES = {
    studio: {
      kicker: "Control plane · you rent", title: "Studio",
      role: 'The <span class="hl">face a person operates</span> — author an agent, read a certification’s evidence, decide a held action, and watch every run’s trace as it happens.',
      owns: ["Authoring: agents, tools, skills, playbooks", "The approvals queue & certification review", "Run traces, grounding verdicts, deviations", "Organization: users, teams, grants"],
      not: ["Any runtime or durable run state", "Any secret or model credential", "The authority to decide — that’s policy"],
      proofs: [
        { s: "p", t: "running in dev", c: "Certification review, run faces and audit export render against a real stack — approving a pending certification re-signs it in the registry." }
      ]
    },
    registry: {
      kicker: "Control plane · you rent", title: "Registry",
      role: '<span class="hl">Declarative truth, never runtime state.</span> Every agent version is immutable and pinned to its exact content; a run references a version, never an inline definition it could drift from.',
      owns: ["Immutable, content-pinned agent versions", "Policy bundles, sandbox manifests", "Certification records — signed evidence", "Deployments: aliases pinning exact versions"],
      not: ["Runtime execution or run state", "Secrets — only pointers to them", "Cross-tenant reads — isolation is enforced"],
      proofs: [
        { s: "p", t: "certification", c: "An uncertified version cannot deploy; a certification binds to exact content and never transfers — a tampered bundle fails with the exact reason." },
        { s: "p", t: "tenant isolation", c: "One tenant cannot read another’s definitions — enforced at the database itself, not just the API, and verified by a test against the running system." }
      ]
    },
    gateway: {
      kicker: "Data plane · you own", title: "The runtime — the harness",
      role: 'It <span class="hl">thinks, coordinates, authorizes, remembers and records.</span> Your agents, the policy gate, the approvals and the audit chain all live in the trusted harness — never in the box that runs untrusted code.',
      owns: ["Your agents & their model calls", "admit() — every risky action clears policy first", "Approvals & approver authority", "The hash-chained audit trail", "Durable run state — a parked run resumes where it stopped"],
      not: ["Shell or generated-code execution", "A browser or an untrusted document", "Long-lived business credentials near the agent"],
      proofs: [
        { s: "p", t: "argument-derived", c: "A $10 refund passes and a $10,000 refund holds on the same tool — the amount itself derives the label the policy matches." },
        { s: "p", t: "exactly-once", c: "An approval executes exactly once; a decision is single-use, bound to the exact arguments, and expires." },
        { s: "p", t: "any framework", c: "A wrapped LangChain or CrewAI agent is held exactly like a native one — same gate, same chain." }
      ]
    },
    sandbox: {
      kicker: "Data plane · you own", title: "The sandbox — the compute",
      role: 'The boundary for <span class="hl">all model-directed execution.</span> It runs the untrusted work — and owns nothing. It decides nothing, holds no secret, carries no authority. A compromised box is a disposable filesystem.',
      owns: ["Shell, generated code, generated tools", "Browser automation & untrusted documents", "A temporary, per-run workspace", "Declared network profiles"],
      not: ["Any authority — it cannot approve or admit", "Secrets — it runs secret-free by construction", "Another tenant’s files, environment, or definitions"],
      proofs: [
        { s: "p", t: "spawn-bound", c: "A session is bound to its tenant when it is created — one tenant’s box cannot obtain another’s secrets or definitions; a mismatch is a hard error, never a fallback." },
        { s: "p", t: "os-enforced egress", c: "An offline session’s network is removed by the operating system, not by convention; an allowlisted one reaches only declared hosts." },
        { s: "d", t: "in development", c: "Brokered wide-web egress through a controlled proxy, and warm per-tenant pools, are designed and on the roadmap." }
      ]
    },
    models: {
      kicker: "Data plane · you own", title: "Models",
      role: 'Your providers, your keys, <span class="hl">brokered by the harness.</span> The runtime routes every model call — OpenAI, Anthropic, or an OpenAI-compatible endpoint including your own vLLM — so the choice is configuration, and the credential never leaves your plane.',
      owns: ["Provider selection, per agent or run", "Your own API keys & endpoints", "Portability across providers"],
      not: ["Reaching Tulip-hosted services", "Sampling the customer never asked for"],
      proofs: [
        { s: "p", t: "running in dev", c: "Governed runs execute on the customer’s own key; the runtime speaks OpenAI, Anthropic, and OpenAI-compatible endpoints interchangeably." }
      ]
    },
    secrets: {
      kicker: "Data plane · you own", title: "Secrets",
      role: 'Held by a broker <span class="hl">in your own plane</span> and injected only at the moment of a governed call. They never cross the trust boundary up to Tulip, and they never enter the sandbox.',
      owns: ["Business-system & model credentials", "Brokering at the point of a governed action", "Per-agent secret scoping"],
      not: ["Ever reaching a Tulip-hosted service", "Ever entering the untrusted box", "Ever landing in a trace or the audit chain"],
      proofs: [
        { s: "p", t: "secret-free box", c: "The sandbox runs secret-free by construction, and secrets never appear in the durable trace." },
        { s: "d", t: "in development", c: "The customer-account data-plane package ships with a zero-secret-egress proof as its exit criterion." }
      ]
    }
  };

  var content = document.getElementById("inspContent");
  var icons = {};
  stage.querySelectorAll("[data-node]").forEach(function (btn) {
    var svg = btn.querySelector(".ico svg");
    if (svg) icons[btn.getAttribute("data-node")] = svg.outerHTML;
  });

  function render(key) {
    var n = NODES[key];
    if (!n || !content) return;
    var owns = n.owns.map(function (x) { return "<li>" + x + "</li>"; }).join("");
    var nots = n.not.map(function (x) { return "<li>" + x + "</li>"; }).join("");
    var proofs = n.proofs.map(function (p) {
      return '<div class="proof"><span class="tag ' + (p.s === "p" ? "p" : "d") + '">' + p.t + "</span><span class=\"claim\">" + p.c + "</span></div>";
    }).join("");
    content.innerHTML =
      '<div class="insp-top"><span class="ico">' + (icons[key] || "") + "</span>" +
      '<span><span class="insp-t1">' + n.kicker + '</span><span class="insp-t2">' + n.title + "</span></span></div>" +
      '<p class="insp-role">' + n.role + "</p>" +
      '<p class="insp-h">Owns</p><ul class="insp-list">' + owns + "</ul>" +
      '<p class="insp-h">Does not own</p><ul class="insp-list not">' + nots + "</ul>" +
      '<p class="insp-h">The receipts</p>' + proofs;
    stage.querySelectorAll("[data-node]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-node") === key);
    });
  }

  stage.querySelectorAll("[data-node]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      render(btn.getAttribute("data-node"));
    });
    btn.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && btn.tagName !== "BUTTON") {
        e.preventDefault();
        render(btn.getAttribute("data-node"));
      }
    });
  });
})();
