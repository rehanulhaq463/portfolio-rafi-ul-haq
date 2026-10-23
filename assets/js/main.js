/* Rafiul Haq — site interactions (no dependencies) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Header state ---------- */
  const header = $("[data-header]");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = $("[data-menu-toggle]");
  const nav = $("[data-nav]");
  const setMenu = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".sr-only").textContent = open ? "Close menu" : "Open menu";
    if (open) { const first = nav.querySelector("a"); first && first.focus(); }
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 1081px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });

  /* ---------- Active section in nav ---------- */
  const links = $$('.primary-nav ul a[href^="#"]');
  const sections = links.map((a) => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.removeAttribute("aria-current"));
          const a = links.find((l) => l.getAttribute("href") === "#" + en.target.id);
          a && a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Scroll reveals (staggered within groups) ---------- */
  const revealEls = $$(".reveal");
  // stagger siblings that share a parent
  const groups = new Map();
  revealEls.forEach((el) => {
    const g = groups.get(el.parentElement) || [];
    g.push(el); groups.set(el.parentElement, g);
  });
  groups.forEach((g) => g.forEach((el, i) => el.style.setProperty("--stagger", Math.min(i, 5) * 90 + "ms")));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    $$(".timeline").forEach((t) => t.classList.add("is-drawn"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
    const tio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-drawn"); tio.unobserve(en.target); } });
    }, { threshold: 0.05 });
    $$(".timeline").forEach((t) => tio.observe(t));
  }

  /* ---------- Generated landscape plates ---------- */
  // Deterministic pseudo-random so each plate looks the same on every visit.
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const hash = (str) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

  const motifs = {
    delta(r) { // braided river channels flowing to the sea
      let out = "";
      for (let i = 0; i < 9; i++) {
        let y = 20 + r() * 210, d = `M-10 ${y.toFixed(1)}`;
        for (let x = 40; x <= 440; x += 60) {
          y += (r() - 0.5) * 50; y = Math.max(10, Math.min(240, y));
          d += ` S${(x - 25).toFixed(1)} ${(y + (r() - .5) * 30).toFixed(1)} ${x} ${y.toFixed(1)}`;
        }
        out += `<path d="${d}" fill="none" stroke="var(--plate-line)" stroke-width="${(0.6 + r() * 2.2).toFixed(2)}" opacity="${(0.35 + r() * 0.5).toFixed(2)}" stroke-linecap="round"/>`;
      }
      for (let i = 0; i < 5; i++) {
        const cx = 40 + r() * 330, cy = 30 + r() * 190, rx = 10 + r() * 34, ry = 4 + r() * 12;
        out += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="var(--plate-line)" opacity=".14" transform="rotate(${(r() * 40 - 20).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;
      }
      out += `<circle cx="${(300 + r() * 60).toFixed(0)}" cy="52" r="16" fill="var(--plate-accent)" opacity=".85"/>`;
      return out;
    },
    mangrove(r) { // canopy with prop roots above tidal water
      let out = `<rect x="0" y="168" width="400" height="90" fill="var(--plate-line)" opacity=".12"/>`;
      for (let i = 0; i < 6; i++) out += `<path d="M${(r() * 60).toFixed(0)} ${180 + i * 12} h${(80 + r() * 260).toFixed(0)}" stroke="var(--plate-line)" stroke-width="1" opacity=".4"/>`;
      let x = -20;
      while (x < 420) {
        const w = 34 + r() * 46, h = 50 + r() * 70, top = 168 - h - 18;
        out += `<ellipse cx="${(x + w / 2).toFixed(1)}" cy="${(top + 20).toFixed(1)}" rx="${(w / 1.6).toFixed(1)}" ry="${(18 + r() * 14).toFixed(1)}" fill="var(--plate-line)" opacity="${(0.35 + r() * 0.35).toFixed(2)}"/>`;
        for (let k = 0; k < 4; k++) {
          const sx = x + w / 2 + (r() - .5) * 8, ex = x + r() * w;
          out += `<path d="M${sx.toFixed(1)} ${(top + 30).toFixed(1)} Q${((sx + ex) / 2).toFixed(1)} ${(150 - r() * 30).toFixed(1)} ${ex.toFixed(1)} 172" fill="none" stroke="var(--plate-line)" stroke-width="1.3" opacity=".7"/>`;
        }
        x += w * 0.8;
      }
      out += `<circle cx="${(60 + r() * 80).toFixed(0)}" cy="40" r="14" fill="var(--plate-accent)" opacity=".8"/>`;
      return out;
    },
    contour(r) { // topographic lines
      let out = "";
      const cx = 120 + r() * 160, cy = 80 + r() * 90;
      for (let i = 1; i <= 14; i++) {
        const base = i * 17, pts = [];
        for (let a = 0; a < 24; a++) {
          const t = (a / 24) * Math.PI * 2, rr = base * (0.85 + r() * 0.3);
          pts.push([cx + Math.cos(t) * rr * 1.5, cy + Math.sin(t) * rr]);
        }
        let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
        for (let k = 1; k <= pts.length; k++) {
          const p = pts[k % pts.length], q = pts[(k + 1) % pts.length];
          d += ` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${((p[0] + q[0]) / 2).toFixed(1)} ${((p[1] + q[1]) / 2).toFixed(1)}`;
        }
        out += `<path d="${d}Z" fill="none" stroke="var(--plate-line)" stroke-width="${i % 5 === 0 ? 1.6 : 0.8}" opacity="${i % 5 === 0 ? 0.8 : 0.45}"/>`;
      }
      out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4" fill="var(--plate-accent)"/>`;
      return out;
    },
    rows(r) { // planting rows receding toward the horizon
      let out = `<path d="M0 92 H400" stroke="var(--plate-line)" stroke-width="1" opacity=".6"/>`;
      for (let row = 0; row < 11; row++) {
        const t = row / 10, y = 100 + Math.pow(t, 1.6) * 150, n = 10 + row * 2, size = 1.2 + t * 5;
        for (let i = 0; i <= n; i++) {
          const x = 200 + (i / n - 0.5) * (120 + t * 560) + (r() - .5) * 4;
          out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(2)}" fill="var(--plate-line)" opacity="${(0.45 + t * 0.4).toFixed(2)}"/>`;
        }
      }
      out += `<circle cx="${(280 + r() * 60).toFixed(0)}" cy="50" r="15" fill="var(--plate-accent)" opacity=".85"/>`;
      return out;
    },
    wind(r) { // turbines on a coastal horizon
      let out = `<path d="M0 182 H400" stroke="var(--plate-line)" stroke-width="1" opacity=".7"/>`;
      for (let i = 0; i < 6; i++) out += `<path d="M${(r() * 120).toFixed(0)} ${192 + i * 10} h${(120 + r() * 240).toFixed(0)}" stroke="var(--plate-line)" opacity=".35"/>`;
      for (let i = 0; i < 7; i++) {
        const x = 30 + i * 55 + (r() - .5) * 16, h = 60 + r() * 50, top = 182 - h, rot = r() * 120;
        out += `<path d="M${x.toFixed(1)} 182 L${x.toFixed(1)} ${top.toFixed(1)}" stroke="var(--plate-line)" stroke-width="1.6"/>`;
        for (let b = 0; b < 3; b++) {
          const a = ((rot + b * 120) * Math.PI) / 180, L = 18 + h * 0.18;
          out += `<path d="M${x.toFixed(1)} ${top.toFixed(1)} L${(x + Math.cos(a) * L).toFixed(1)} ${(top + Math.sin(a) * L).toFixed(1)}" stroke="var(--plate-line)" stroke-width="1.2" stroke-linecap="round"/>`;
        }
      }
      out += `<circle cx="330" cy="46" r="14" fill="var(--plate-accent)" opacity=".8"/>`;
      return out;
    },
    juniper(r) { // conifers on layered hills
      let out = "";
      for (let l = 0; l < 3; l++) {
        const base = 120 + l * 45;
        let d = `M0 ${base}`;
        for (let x = 0; x <= 400; x += 50) d += ` Q${x + 25} ${(base - 20 - r() * 30).toFixed(1)} ${x + 50} ${(base + (r() - .5) * 14).toFixed(1)}`;
        out += `<path d="${d} V260 H0Z" fill="var(--plate-line)" opacity="${(0.15 + l * 0.12).toFixed(2)}"/>`;
        for (let i = 0; i < 8 + l * 4; i++) {
          const x = r() * 400, y = base + 4 + r() * 14, h = 10 + l * 9 + r() * 8;
          out += `<path d="M${x.toFixed(1)} ${(y - h).toFixed(1)} L${(x + h * 0.32).toFixed(1)} ${y.toFixed(1)} L${(x - h * 0.32).toFixed(1)} ${y.toFixed(1)}Z" fill="var(--plate-accent)" opacity="${(0.45 + l * 0.2).toFixed(2)}"/>`;
        }
      }
      return out;
    },
  };

  $$(".plate[data-motif]").forEach((plate, idx) => {
    const motif = motifs[plate.dataset.motif];
    if (!motif) return;
    const r = rng(hash(plate.dataset.motif + plate.dataset.tone + idx));
    const svg = `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" focusable="false">${motif(r)}</svg>`;
    plate.insertAdjacentHTML("afterbegin", svg);
  });

  /* ---------- Case-note dialogs ---------- */
  const dialog = $("[data-dialog]");
  const dialogContent = $("[data-dialog-content]");
  let lastTrigger = null;
  $$("[data-open]").forEach((btn) => {
    btn.setAttribute("aria-haspopup", "dialog");
    btn.addEventListener("click", () => {
      const tpl = document.getElementById("tpl-" + btn.dataset.open);
      if (!tpl || !dialog) return;
      dialogContent.replaceChildren(tpl.content.cloneNode(true));
      const h = dialogContent.querySelector("h3");
      if (h) h.id = "dialog-title";
      lastTrigger = btn;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
  });
  const closeDialog = () => { dialog.close ? dialog.close() : dialog.removeAttribute("open"); };
  $("[data-dialog-close]").addEventListener("click", closeDialog);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) closeDialog(); });
  dialog.addEventListener("close", () => lastTrigger && lastTrigger.focus());

  /* ---------- Contact form ---------- */
  const form = $("[data-contact-form]");
  const statusEl = $("[data-form-status]");
  const RECIPIENT = "rafiulhaq@gmail.com";
  const endpoint = (form.dataset.endpoint || "").trim();
  if (endpoint) $("[data-form-note]").textContent = "Your message is sent directly to Rafiul Haq. You’ll see a confirmation here once it has been delivered.";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    let firstInvalid = null;
    $$("input[required], textarea[required]", form).forEach((f) => {
      const bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.setAttribute("aria-invalid", String(bad));
      if (bad && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      statusEl.textContent = "Please complete your name, a valid email address and a short description of the project.";
      firstInvalid.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());

    if (endpoint) {
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; statusEl.textContent = "Sending…";
      try {
        const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        statusEl.textContent = "Thank you — your inquiry has been delivered.";
      } catch (err) {
        statusEl.innerHTML = `The message could not be sent just now. Please email <a href="mailto:${RECIPIENT}">${RECIPIENT}</a> directly.`;
      } finally { btn.disabled = false; }
      return;
    }

    // Email fallback: compose a pre-filled message in the visitor's email app.
    const subject = `Project inquiry: ${data.type}${data.organisation ? " — " + data.organisation : ""}`;
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.organisation ? `Organisation: ${data.organisation}` : null,
      `Type of work: ${data.type}`,
      "",
      data.message,
    ].filter((l) => l !== null).join("\n");
    window.location.href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    statusEl.innerHTML = `Your email app should now open with the message ready to send. If nothing happened, email <a href="mailto:${RECIPIENT}">${RECIPIENT}</a> directly.`;
  });

  /* ---------- Footer year ---------- */
  const y = $("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());
})();
