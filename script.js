/**
 * ==========================================================================
 * CHECK-UP DI MOBILITÀ — JAVASCRIPT LOGIC (ANDREA BOLZAN)
 * GoHighLevel Compatible & Resilient Script
 * Scoped inside #ab-mobility-checkup
 * ==========================================================================
 */

(function () {
  const DEFAULT_CONFIG = {
    checkoutUrl: "https://andreabolzan.com/acquisto",
    whatsappUrl: "https://wa.me/393407982266?text=Ciao%20Andrea%2C%20vorrei%20informazioni%20sul%20Check-up%20di%20Mobilit%C3%A0",
    deadlineISO: "2026-10-05T23:00:00+02:00", // Scade alle 23:00 di lunedì (5 ottobre 2026)
    promoPrice: "57 €",
    regularPrice: "150 €",
    availableSpots: "max 6",
    enableAnimations: true,
    enableStickyCta: true
  };

  // Supporta eventuale override esterno via window.AB_CONFIG senza inquinare lo scope globale
  const externalConfig = typeof window !== "undefined" && window.AB_CONFIG ? window.AB_CONFIG : {};
  const AB_CONFIG = Object.assign({}, DEFAULT_CONFIG, externalConfig);

  let initialized = false;

  function initABPage() {
    if (initialized) return;
    initialized = true;

    const root = document.getElementById("ab-mobility-checkup");
    if (!root) return;

    // 0. Listener touch per abilitare lo stato :active su iOS Safari
    document.addEventListener("touchstart", function () {}, { passive: true });

    // 1. Configurazione dinamica dei link e testi ripetuti
    setupLinks(root);

    // 2. Gestione Countdown
    setupCountdown(root);

    // 3. Gestione Sticky Mobile CTA
    if (AB_CONFIG.enableStickyCta) {
      setupStickyCta(root);
    }

    // 3b. Reveal allo scroll con stagger e slider swipe
    setupScrollReveal(root);
    setupVideoModal(root);
    setupHeroVideoPoster(root);
    setupChatSlider(root);
    setupProofSlider(root);
    setupImageFade(root);

    // 4. Inizializzazione controllata GSAP (se presente ed abilitato)
    if (AB_CONFIG.enableAnimations) {
      setupGsapAnimations(root);
    }
  }

  /**
   * Helper per preservare/inoltrare query parameters (es. parametri UTM o tracciamento)
   */
  function appendQueryParams(baseUrl) {
    if (!baseUrl || baseUrl.startsWith("#")) {
      return baseUrl;
    }
    if (!window.location.search) {
      return baseUrl;
    }
    try {
      const incomingParams = new URLSearchParams(window.location.search);
      const targetUrl = new URL(baseUrl, window.location.href);
      incomingParams.forEach(function (val, key) {
        if (!targetUrl.searchParams.has(key)) {
          targetUrl.searchParams.set(key, val);
        }
      });
      return targetUrl.toString();
    } catch (e) {
      return baseUrl;
    }
  }

  /**
   * Valorizza tutti i link CTA con gli URL di configurazione e aggiorna i testi di prezzo/posti
   */
  function setupLinks(root) {
    const checkoutLinks = root.querySelectorAll("[data-checkout-link]");
    checkoutLinks.forEach(function (link) {
      const currentHref = link.getAttribute("href");
      const targetBase = (AB_CONFIG.checkoutUrl && AB_CONFIG.checkoutUrl !== "#CHECKOUT_URL")
        ? AB_CONFIG.checkoutUrl
        : (currentHref && currentHref !== "#CHECKOUT_URL" ? currentHref : AB_CONFIG.checkoutUrl);
      if (targetBase && targetBase !== "") {
        link.setAttribute("href", appendQueryParams(targetBase));
      }
    });

    const whatsappLinks = root.querySelectorAll("[data-whatsapp-link]");
    whatsappLinks.forEach(function (link) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      const currentHref = link.getAttribute("href");
      const targetBase = (AB_CONFIG.whatsappUrl && AB_CONFIG.whatsappUrl !== "#WHATSAPP_URL")
        ? AB_CONFIG.whatsappUrl
        : (currentHref && currentHref !== "#WHATSAPP_URL" ? currentHref : AB_CONFIG.whatsappUrl);
      if (targetBase && targetBase !== "") {
        link.setAttribute("href", appendQueryParams(targetBase));
      }
    });

    // Aggiornamento prezzi promo e regolari
    const promoElements = root.querySelectorAll("[data-promo-price]");
    promoElements.forEach(function (el) {
      el.textContent = AB_CONFIG.promoPrice;
    });

    const regularElements = root.querySelectorAll("[data-regular-price]");
    regularElements.forEach(function (el) {
      el.textContent = AB_CONFIG.regularPrice;
    });

    // Aggiornamento posti disponibili
    const spotsElements = root.querySelectorAll("[data-spots-available]");
    spotsElements.forEach(function (el) {
      el.textContent = AB_CONFIG.availableSpots;
    });
  }

  /**
   * Gestione rigorosa del countdown:
   * Se deadlineISO è vuoto, non valido o passato -> non mostra nulla, non crea urgenza simulata, non mostra zeri.
   * Se deadlineISO è una data futura valida -> attiva la visualizzazione e avvia il timer.
   */
  function setupCountdown(root) {
    const topBar = root.querySelector("[data-countdown-top-bar]");
    const offerCountdownBox = root.querySelector("[data-countdown-offer-box]");

    const rawDeadline = AB_CONFIG.deadlineISO;
    if (!rawDeadline || typeof rawDeadline !== "string" || rawDeadline.trim() === "") {
      return;
    }

    let targetDate;
    if (rawDeadline === "next-monday-23" || rawDeadline === "next-monday") {
      const now = new Date();
      const nextMon = new Date(now);
      const daysUntilMonday = ((1 + 7 - now.getDay()) % 7) || 7;
      nextMon.setDate(now.getDate() + daysUntilMonday);
      nextMon.setHours(23, 0, 0, 0);
      targetDate = nextMon.getTime();
    } else {
      targetDate = new Date(rawDeadline).getTime();
    }

    if (isNaN(targetDate)) {
      return;
    }

    const initialNow = Date.now();
    if (targetDate <= initialNow) {
      return;
    }

    // Data futura valida: rendi attive le sezioni countdown
    if (topBar) topBar.classList.add("ab-top-bar--active");
    if (offerCountdownBox) offerCountdownBox.classList.add("ab-countdown--active");

    const timerDisplays = root.querySelectorAll("[data-countdown-display]");

    function padZero(num) {
      return num < 10 ? "0" + num : String(num);
    }

    function updateTimer() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (topBar) topBar.classList.remove("ab-top-bar--active");
        if (offerCountdownBox) offerCountdownBox.classList.remove("ab-countdown--active");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let timeString = "";
      if (days > 0) {
        timeString = days + "g " + padZero(hours) + "h " + padZero(minutes) + "m " + padZero(seconds) + "s";
      } else {
        timeString = padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);
      }

      timerDisplays.forEach(function (display) {
        display.textContent = timeString;
      });
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /**
   * Sticky CTA Mobile:
   * Appare dopo che l'Hero fold è uscito dallo scroll superiore;
   * Scompare durante la visualizzazione della card offerta o nel footer per evitare sovrapposizioni.
   */
  function setupStickyCta(root) {
    const stickyBar = root.querySelector(".ab-sticky-mobile-cta");
    const heroTarget = root.querySelector(".ab-hero") || root.querySelector("[data-hero-cta]");
    const offerCard = root.querySelector(".ab-pricing-card") || root.querySelector(".ab-offer-box") || root.querySelector("#ab-sezione-offerta");
    const footer = root.querySelector("#ab-footer") || root.querySelector(".ab-footer");

    if (!stickyBar || !heroTarget) return;

    if ("IntersectionObserver" in window) {
      let heroPassed = false;
      let hideAreaActive = false;

      function updateStickyVisibility() {
        if (heroPassed && !hideAreaActive) {
          stickyBar.classList.add("ab-sticky--visible");
        } else {
          stickyBar.classList.remove("ab-sticky--visible");
        }
      }

      // Osserva l'uscita dell'Hero fold verso l'alto
      const heroObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
            updateStickyVisibility();
          });
        },
        { threshold: 0 }
      );
      heroObserver.observe(heroTarget);

      // Osserva l'ingresso e la visualizzazione della card offerta o del footer
      const hideElements = [offerCard, footer].filter(Boolean);
      const intersectingMap = new Map();
      const hideObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            intersectingMap.set(entry.target, entry.isIntersecting);
          });
          let anyIntersecting = false;
          intersectingMap.forEach(function (isIntersecting) {
            if (isIntersecting) anyIntersecting = true;
          });
          hideAreaActive = anyIntersecting;
          updateStickyVisibility();
        },
        { threshold: 0 }
      );

      hideElements.forEach(function (el) {
        hideObserver.observe(el);
      });
    }
  }


  /**
   * Reveal allo scroll con stagger: opacity + translateY via IntersectionObserver.
   * Esclude l'hero (above the fold) e, se GSAP/ScrollTrigger è presente, gli elementi che anima già lui.
   * Senza IntersectionObserver o con reduced-motion non nasconde nulla.
   */
  function setupScrollReveal(root) {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gsapOwned = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
    const groups = [
      ".ab-section:not(.ab-hero) .ab-eyebrow, .ab-section:not(.ab-hero) .ab-title-h2, .ab-section:not(.ab-hero) .ab-subtitle",
      ".ab-reveal-item, .ab-chat-slider-wrap, .ab-problem-card, .ab-reassurance-box, .ab-journey-connector-bar",
      ".ab-why-card, .ab-destination-item, .ab-dest-feature, .ab-bio-photo-card, .ab-metric-item, .ab-qualify-card",
      ".ab-objection-card, .ab-offer-item, .ab-faq-item, .ab-method-formula, .ab-info-callout, .ab-quote-ugolini"
    ];
    if (!gsapOwned) groups.push(".ab-step-card", ".ab-map-mockup-wrapper", ".ab-map-q-item", ".ab-offer-box");

    const targets = Array.prototype.slice.call(root.querySelectorAll(groups.join(",")));
    if (targets.length === 0) return;

    // Indice di stagger per fratelli consecutivi dello stesso contenitore (max 5 passi)
    const counters = new Map();
    targets.forEach(function (el) {
      const parent = el.parentElement;
      const n = counters.get(parent) || 0;
      counters.set(parent, n + 1);
      el.style.setProperty("--ab-i", String(Math.min(n, 5)));
      el.setAttribute("data-ab-reveal", "");
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("ab-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    root.classList.add("ab-js");
    targets.forEach(function (el) { observer.observe(el); });
  }


  /**
   * Immagini lazy: fade-in quando arrivano (placeholder colorato nel CSS).
   * Solo per le immagini non ancora caricate; error/load sbloccano sempre la visibilita'.
   */
  /**
   * Hero video: nasconde l'anteprima quando il player di Drive ha avuto il tempo di prepararsi
   * (l'evento load arriva prima che il player sia visibile) o appena l'utente tocca il video.
   */
  function setupHeroVideoPoster(root) {
    const iframe = root.querySelector(".ab-hero-video");
    if (!iframe || !root.querySelector(".ab-hero-video-poster")) return;
    const box = iframe.parentElement;
    const PLAYER_READY_DELAY = 2500;
    let revealed = false;
    function reveal() {
      if (revealed) return;
      revealed = true;
      box.classList.add("is-ready");
    }
    function afterLoad() { window.setTimeout(reveal, PLAYER_READY_DELAY); }
    if (iframe.classList.contains("is-loaded")) afterLoad();
    else iframe.addEventListener("load", afterLoad, { once: true });
    // Il tocco sull'iframe sposta il focus fuori dalla pagina
    window.addEventListener("blur", function () {
      if (document.activeElement === iframe) reveal();
    });
    window.setTimeout(reveal, 10000);
  }

  function setupImageFade(root) {
    root.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      if (img.complete) return;
      img.classList.add("ab-img-wait");
      const done = function () { img.classList.remove("ab-img-wait"); };
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
  }

  /**
   * Helper per slider touch con scroll-snap nativo CSS: fade ai bordi + pallini di posizione e tap navigazione.
   */
  function setupSliderDotsAndFade(slider, cardSelector, dotsClass, fadeLVar, fadeRVar) {
    if (!slider) return;
    const cards = Array.prototype.slice.call(slider.querySelectorAll(cardSelector));
    if (cards.length < 2) return;
    const total = cards.length;

    const autoScrollControl = setupAutoScroll(slider, cards);

    const dots = document.createElement("div");
    dots.className = dotsClass;
    dots.setAttribute("aria-hidden", "true");
    const dotEls = cards.map(function (card, i) {
      const d = document.createElement("span");
      d.className = "ab-slider-dot";
      d.setAttribute("role", "button");
      d.setAttribute("tabindex", "0");
      d.setAttribute("aria-label", "Vai alla slide " + (i + 1));
      function goToSlide() {
        if (autoScrollControl && autoScrollControl.pause) {
          autoScrollControl.pause();
        }
        card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        if (autoScrollControl && autoScrollControl.resumeLater) {
          autoScrollControl.resumeLater(3000);
        }
      }
      d.addEventListener("click", goToSlide);
      d.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToSlide();
        }
      });
      dots.appendChild(d);
      return d;
    });
    slider.insertAdjacentElement("afterend", dots);

    let ticking = false;
    let cardOffsets = [];
    let loopW = 0;
    let currentActive = -1;
    let lastFadeL = null;
    let lastFadeR = null;

    function computeGeometry() {
      if (cards.length === 0) return;
      const base = cards[0].offsetLeft;
      cardOffsets = cards.map(function (card) {
        return card.offsetLeft - base;
      });
      const firstClone = slider.querySelector(".ab-clone");
      if (firstClone) {
        loopW = firstClone.offsetLeft - base;
      }
    }
    computeGeometry();

    function getCardOffsets() {
      if (cardOffsets.length === 0 || (total > 1 && cardOffsets[1] === 0)) {
        computeGeometry();
      }
      return cardOffsets;
    }

    function update() {
      ticking = false;
      const looping = slider.classList.contains("ab-autoscrolling");
      const max = looping ? 0 : (slider.scrollWidth - slider.clientWidth);
      const x = slider.scrollLeft;

      const fadeL = looping || x > 4 ? "36px" : "0px";
      const fadeR = looping || x < max - 24 ? "36px" : "0px";
      if (fadeLVar && fadeL !== lastFadeL) {
        lastFadeL = fadeL;
        slider.style.setProperty(fadeLVar, fadeL);
      }
      if (fadeRVar && fadeR !== lastFadeR) {
        lastFadeR = fadeR;
        slider.style.setProperty(fadeRVar, fadeR);
      }

      let active = 0;
      const offsets = getCardOffsets();
      if (offsets.length > 0) {
        let best = Infinity;
        const normX = (loopW > 0) ? (x % loopW) : x;
        for (let i = 0; i < total; i++) {
          const dist = Math.abs(offsets[i] - normX);
          if (dist < best) {
            best = dist;
            active = i;
          }
        }
      }
      if (!looping && max > 0 && x >= max - 24) {
        active = total - 1;
      }

      if (active !== currentActive) {
        currentActive = active;
        dotEls.forEach(function (d, i) {
          d.classList.toggle("is-active", i === active);
        });
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    slider.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      computeGeometry();
      onScroll();
    });
    slider.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) {
        img.addEventListener("load", function () {
          computeGeometry();
          onScroll();
        }, { once: true });
      }
    });
    update();
  }


  /**
   * Scorrimento lento e continuo (loop infinito con card clonate).
   * Si ferma con hover del mouse, tocco/dito appoggiato, focus da tastiera o scroll manuale,
   * e riparte 3 s dopo il rilascio. Disattivato con prefers-reduced-motion e fuori schermo.
   */
  function setupAutoScroll(slider, originals) {
    if (!slider || !slider.classList.contains("ab-auto-slider") || originals.length < 2) return null;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

    const clones = originals.map(function (card) {
      const clone = card.cloneNode(true);
      clone.classList.add("ab-clone");
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("tabindex", "-1");
      clone.querySelectorAll("a, button, [tabindex]").forEach(function (el) { el.setAttribute("tabindex", "-1"); });
      clone.querySelectorAll("img").forEach(function (img) { img.setAttribute("alt", ""); });
      slider.appendChild(clone);
      return clone;
    });
    slider.classList.add("ab-autoscrolling");

    const SPEED = 24; // px al secondo
    const RESUME_DELAY = 3000;
    let pos = slider.scrollLeft;
    let paused = false;
    let inView = false;
    let rafId = 0;
    let last = 0;
    let resumeTimer = 0;
    let cachedLw = 0;

    function computeLoopWidth() {
      if (clones.length > 0 && originals.length > 0) {
        cachedLw = clones[0].offsetLeft - originals[0].offsetLeft;
      }
      return cachedLw;
    }

    function getLoopWidth() {
      if (cachedLw <= 0) {
        computeLoopWidth();
      }
      return cachedLw;
    }

    let modalEl = null;
    function isModalOpen() {
      if (!modalEl) modalEl = document.querySelector(".ab-video-modal");
      return !!(modalEl && modalEl.open);
    }

    function tick(ts) {
      rafId = 0;
      if (!inView || document.hidden || isModalOpen() || paused) { last = 0; return; }
      if (!last) last = ts;
      const dt = Math.min(ts - last, 64);
      last = ts;
      if (Math.abs(slider.scrollLeft - pos) > 2) pos = slider.scrollLeft; // l'utente ha spostato lo slider
      pos += (SPEED * dt) / 1000;
      const lw = getLoopWidth();
      if (lw > 0 && pos >= lw) {
        pos -= lw;
        slider.scrollLeft = pos;
      } else if (lw > 0 && pos < 0) {
        pos += lw;
        slider.scrollLeft = pos;
      } else {
        slider.scrollLeft = pos;
      }
      rafId = window.requestAnimationFrame(tick);
    }

    function start() {
      if (!rafId && inView && !document.hidden && !isModalOpen() && !paused) { last = 0; rafId = window.requestAnimationFrame(tick); }
    }

    function pause() {
      paused = true;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      last = 0;
      slider.style.scrollSnapType = "x mandatory";
      slider.classList.add("is-paused");
      window.clearTimeout(resumeTimer);
    }

    function resumeLater(delay) {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(function () {
        if (isModalOpen()) return;
        pos = slider.scrollLeft;
        const lw = getLoopWidth();
        if (lw > 0 && pos >= lw) {
          pos -= lw;
          slider.scrollLeft = pos;
        }
        slider.style.scrollSnapType = "none";
        slider.classList.remove("is-paused");
        paused = false;
        start();
      }, delay);
    }

    // Mouse: ferma al passaggio, riparte all'uscita (3 secondi)
    slider.addEventListener("mouseenter", pause);
    slider.addEventListener("mouseleave", function () { resumeLater(RESUME_DELAY); });
    // Touch: ferma appena il dito si appoggia, riparte dopo il rilascio
    slider.addEventListener("touchstart", pause, { passive: true });
    slider.addEventListener("touchend", function () { resumeLater(RESUME_DELAY); }, { passive: true });
    slider.addEventListener("touchcancel", function () { resumeLater(RESUME_DELAY); }, { passive: true });
    // Rotella/trackpad orizzontale e tastiera
    slider.addEventListener("wheel", function () { pause(); resumeLater(RESUME_DELAY); }, { passive: true });
    slider.addEventListener("focusin", pause);
    slider.addEventListener("focusout", function () { resumeLater(RESUME_DELAY); });

    slider.addEventListener("ab-pause", pause);
    slider.addEventListener("ab-resume", function () { resumeLater(RESUME_DELAY); });

    window.addEventListener("resize", computeLoopWidth);
    slider.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) {
        img.addEventListener("load", computeLoopWidth, { once: true });
      }
    });

    document.addEventListener("visibilitychange", start);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) {
          computeLoopWidth();
          start();
        }
      }, { threshold: 0.1 }).observe(slider);
    } else {
      inView = true;
      computeLoopWidth();
      start();
    }

    return { pause: pause, resumeLater: resumeLater };
  }

  /**
   * Video testimonianze: apre il player di Google Drive in una finestra modale accessibile.
   * Senza JS (o senza <dialog>) il link apre il video in una nuova scheda.
   */
  function setupVideoModal(root) {
    if (typeof HTMLDialogElement === "undefined") return;
    if (!root.querySelector("[data-video-id]")) return;

    const dialog = document.createElement("dialog");
    dialog.className = "ab-video-modal";
    dialog.setAttribute("aria-label", "Video testimonianza");
    dialog.innerHTML = '<button type="button" class="ab-video-close" aria-label="Chiudi video">\u00d7</button><div class="ab-video-frame"></div>';
    root.appendChild(dialog);
    const frame = dialog.querySelector(".ab-video-frame");
    let opener = null;

    function close() {
      if (dialog.open) dialog.close();
    }

    dialog.addEventListener("close", function () {
      frame.innerHTML = "";
      if (opener && opener.focus) {
        try {
          opener.focus({ preventScroll: true });
        } catch (err) {
          opener.focus();
        }
      }
      root.querySelectorAll(".ab-auto-slider").forEach(function (s) {
        s.dispatchEvent(new CustomEvent("ab-resume"));
      });
    });
    dialog.addEventListener("cancel", function () {
      close();
    });
    dialog.querySelector(".ab-video-close").addEventListener("click", close);
    dialog.addEventListener("click", function (e) { if (e.target === dialog) close(); });

    root.addEventListener("click", function (e) {
      const link = e.target.closest ? e.target.closest("[data-video-id]") : null;
      if (!link) return;
      e.preventDefault();
      opener = link;
      const videoId = link.getAttribute("data-video-id");
      const iframe = document.createElement("iframe");
      iframe.src = "https://drive.google.com/file/d/" + videoId + "/preview";
      iframe.title = link.getAttribute("aria-label") || "Video testimonianza";
      iframe.allow = "autoplay; fullscreen";
      iframe.setAttribute("allowfullscreen", "");

      const fallback = document.createElement("div");
      fallback.className = "ab-video-modal-fallback";
      const fallbackLink = document.createElement("a");
      fallbackLink.href = "https://drive.google.com/file/d/" + videoId + "/view";
      fallbackLink.target = "_blank";
      fallbackLink.rel = "noopener noreferrer";
      fallbackLink.className = "ab-video-modal-fallback-link";
      fallbackLink.textContent = "Non parte il video? Aprilo direttamente su Google Drive";
      fallback.appendChild(fallbackLink);

      frame.innerHTML = "";
      frame.appendChild(iframe);
      frame.appendChild(fallback);

      root.querySelectorAll(".ab-auto-slider").forEach(function (s) {
        s.dispatchEvent(new CustomEvent("ab-pause"));
      });

      dialog.showModal();
    });
  }

  /**
   * Slider chat: fade ai bordi solo dove c'e' altro da scorrere + pallini di posizione.
   */
  function setupChatSlider(root) {
    const slider = root.querySelector(".ab-chat-slider");
    setupSliderDotsAndFade(slider, ".ab-chat-card", "ab-slider-dots", "--ab-fade-l", "--ab-fade-r");
  }

  /**
   * Slider testimonianze scritte e video clienti: peek-ahead swipe con fade e pallini su mobile.
   */
  function setupProofSlider(root) {
    root.querySelectorAll(".ab-proof-grid").forEach(function (slider) {
      setupSliderDotsAndFade(slider, ".ab-proof-card", "ab-slider-dots ab-proof-slider-dots", "--ab-proof-fade-l", "--ab-proof-fade-r");
    });
  }

  /**
   * GSAP Progressive Enhancement:
   * Limitato rigorosamente alle sole 4 aree autorizzate:
   * 1. Hero composta
   * 2. Linea step percorso (Come Funziona)
   * 3. Reveal Mappa del Movimento
   * 4. Reveal selettivo card offerta
   */
  function setupGsapAnimations(root) {
    if (typeof window.gsap === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    try {
      // 1. Entrata Hero composta
      const heroElements = root.querySelectorAll(".ab-hero__content > *");
      if (heroElements.length > 0) {
        gsap.from(heroElements, {
          opacity: 0,
          y: 18,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out"
        });
      }

      // Se ScrollTrigger è caricato via CDN
      if (typeof window.ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // 2. Step percorso in 3 step
        const stepsGrid = root.querySelector(".ab-steps-grid");
        const stepCards = root.querySelectorAll(".ab-step-card");
        if (stepsGrid && stepCards.length > 0) {
          gsap.from(stepCards, {
            scrollTrigger: {
              trigger: stepsGrid,
              start: "top 80%"
            },
            opacity: 0,
            y: 22,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out"
          });
        }

        // 3. Reveal Mappa del Movimento
        const mapHero = root.querySelector(".ab-map-hero");
        const mapMockup = root.querySelector(".ab-map-mockup-wrapper");
        if (mapHero && mapMockup) {
          gsap.from(mapMockup, {
            scrollTrigger: {
              trigger: mapHero,
              start: "top 75%"
            },
            opacity: 0,
            scale: 0.96,
            duration: 0.75,
            ease: "power2.out"
          });
        }

        // 4. Reveal selettivo card offerta
        const offerBox = root.querySelector(".ab-offer-box");
        if (offerBox) {
          gsap.from(offerBox, {
            scrollTrigger: {
              trigger: offerBox,
              start: "top 80%"
            },
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: "power2.out"
          });
        }
      }
    } catch (e) {
      console.warn("[Check-up Mobilità] GSAP init:", e);
    }
  }

  if (typeof document !== "undefined") {
    // Hydration GHL e Fallback DOMContentLoaded per preview locale
    document.addEventListener("hydrationDone", initABPage, { once: true });

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initABPage, { once: true });
    } else {
      initABPage();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { appendQueryParams, setupLinks };
  }
})();
