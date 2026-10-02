/**
 * ==========================================================================
 * CHECK-UP DI MOBILITÀ — JAVASCRIPT LOGIC (ANDREA BOLZAN)
 * GoHighLevel Compatible & Resilient Script
 * Scoped inside #ab-mobility-checkup
 * ==========================================================================
 */

(function () {
  const DEFAULT_CONFIG = {
    checkoutUrl: "#CHECKOUT_URL",
    whatsappUrl: "#WHATSAPP_URL",
    deadlineISO: "", // Lasciare vuoto se non c'è una data precisa. Il timer rimarrà rigorosamente nascosto.
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

    if (!AB_CONFIG.deadlineISO || AB_CONFIG.deadlineISO.trim() === "") {
      return;
    }

    const targetDate = new Date(AB_CONFIG.deadlineISO).getTime();
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
      ".ab-reveal-item, .ab-proof-card, .ab-chat-slider-wrap, .ab-problem-card, .ab-reassurance-box, .ab-journey-connector-bar",
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

    const dots = document.createElement("div");
    dots.className = dotsClass;
    dots.setAttribute("aria-hidden", "true");
    const dotEls = cards.map(function (card, i) {
      const d = document.createElement("span");
      d.className = "ab-slider-dot";
      d.setAttribute("role", "button");
      d.setAttribute("tabindex", "0");
      d.setAttribute("aria-label", "Vai alla slide " + (i + 1));
      d.addEventListener("click", function () {
        card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
      d.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        }
      });
      dots.appendChild(d);
      return d;
    });
    slider.insertAdjacentElement("afterend", dots);

    let ticking = false;
    function update() {
      ticking = false;
      const max = slider.scrollWidth - slider.clientWidth;
      const x = slider.scrollLeft;
      if (fadeLVar) slider.style.setProperty(fadeLVar, x > 4 ? "36px" : "0px");
      if (fadeRVar) slider.style.setProperty(fadeRVar, x < max - 24 ? "36px" : "0px");

      let active = 0;
      let best = Infinity;
      const sliderLeft = slider.getBoundingClientRect().left;
      cards.forEach(function (card, i) {
        const dist = Math.abs(card.getBoundingClientRect().left - sliderLeft);
        if (dist < best) { best = dist; active = i; }
      });
      if (max > 0 && x >= max - 24) active = cards.length - 1;
      dotEls.forEach(function (d, i) { d.classList.toggle("is-active", i === active); });
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }
    slider.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    slider.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) {
        img.addEventListener("load", onScroll, { once: true });
      }
    });
    update();
  }

  /**
   * Slider chat: fade ai bordi solo dove c'e' altro da scorrere + pallini di posizione.
   */
  function setupChatSlider(root) {
    const slider = root.querySelector(".ab-chat-slider");
    setupSliderDotsAndFade(slider, ".ab-chat-card", "ab-slider-dots", "--ab-fade-l", "--ab-fade-r");
  }

  /**
   * Slider recensioni e prove sociali: peek-ahead swipe con fade e pallini su mobile.
   */
  function setupProofSlider(root) {
    const slider = root.querySelector(".ab-proof-grid");
    setupSliderDotsAndFade(slider, ".ab-proof-card", "ab-slider-dots ab-proof-slider-dots", "--ab-proof-fade-l", "--ab-proof-fade-r");
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
