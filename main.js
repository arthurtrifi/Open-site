/* =========================================================
   Open — scripts da homepage
   ========================================================= */

/* ---------- CONFIGURAÇÃO ----------
   WhatsApp: preencha com DDI + DDD + número, só dígitos (ex.: "5598999999999").
   Enquanto estiver vazio, todos os botões "Impulsione já" abrem o direct do Instagram. */
const CONFIG = {
  whatsapp: "5588988526487",
  whatsappMessage: "Olá! Vim pelo site da Open e gostaria de agendar uma reunião.",
  instagramDM: "https://ig.me/m/opencomunicacaomkt",
};

(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* CTAs -> WhatsApp (se configurado) ou Instagram */
  const wa = CONFIG.whatsapp.replace(/\D/g, "");
  const waUrl = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(CONFIG.whatsappMessage)}` : "";
  $$("[data-cta]").forEach((a) => {
    a.href = waUrl || CONFIG.instagramDM;
    a.target = "_blank";
    a.rel = "noopener";
  });
  if (waUrl) {
    const item = $(".wa-item");
    if (item) { item.hidden = false; $("[data-wa-link]", item).href = waUrl; }
  }

  /* Header com fundo ao rolar */
  const header = $(".header");
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu mobile */
  const burger = $("#burger"), nav = $("#nav");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* Animações de entrada ao rolar */
  const items = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-in"));
  }

  /* Vídeo: play/pause estilizado */
  const card = $("#videoCard"), video = $("#aboutVideo"), btn = $("#playBtn");
  const sync = () => {
    const playing = !video.paused && !video.ended;
    card.classList.toggle("is-playing", playing);
    btn.setAttribute("aria-label", playing ? "Pausar vídeo" : "Reproduzir vídeo");
  };
  const toggle = () => {
    if (video.paused) { const p = video.play(); if (p && p.catch) p.catch(sync); }
    else video.pause();
  };
  btn.addEventListener("click", (e) => { e.stopPropagation(); toggle(); });
  video.addEventListener("click", toggle);
  ["play", "pause", "ended"].forEach((ev) => video.addEventListener(ev, sync));
  /* pausa automaticamente ao sair da tela */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting && !video.paused) video.pause(); }), { threshold: 0.2 }).observe(card);
  }
})();
