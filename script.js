/**
 * ==========================================================================
 * CHECK-UP DI MOBILITÀ — JAVASCRIPT LOGIC (ANDREA BOLZAN)
 * GoHighLevel Compatible & Resilient Script
 * Scoped inside #ab-mobility-checkup
 * ==========================================================================
 */

const AB_CONFIG = {
  checkoutUrl: "#CHECKOUT_URL",
  whatsappUrl: "#WHATSAPP_URL",
  deadlineISO: "", // Lasciare vuoto se non c'è una data precisa. Il timer rimarrà rigorosamente nascosto.
  promoPrice: "57 €",
  regularPrice: "150 €",
  availableSpots: "X su 6",
  enableAnimations: true,
  enableStickyCta: true
};

(function () {
  let initialized = false;

  function initABPage() {
    if (initialized) return;
    initialized = true;

    const root = document.getElementById("ab-mobility-checkup");
    if (!root) return;

    // 1. Configurazione dinamica dei link e testi ripetuti
    setupLinks(root);

    // 2. Gestione Countdown
    setupCountdown(root);

    // 3. Gestione Sticky Mobile CTA
    if (AB_CONFIG.enableStickyCta) {
      setupStickyCta(root);
    }

    // 4. Inizializzazione controllata GSAP (se presente ed abilitato)
    if (AB_CONFIG.enableAnimations) {
      setupGsapAnimations(root);
    }
  }

  /**
   * Valorizza tutti i link CTA con gli URL di configurazione e aggiorna i placeholder di prezzo/posti
   */
  function setupLinks(root) {
    const checkoutLinks = root.querySelectorAll("[data-checkout-link]");
    checkoutLinks.forEach(function (link) {
      if (AB_CONFIG.checkoutUrl && AB_CONFIG.checkoutUrl !== "") {
        link.setAttribute("href", AB_CONFIG.checkoutUrl);
      }
    });

    const whatsappLinks = root.querySelectorAll("[data-whatsapp-link]");
    whatsappLinks.forEach(function (link) {
      if (AB_CONFIG.whatsappUrl && AB_CONFIG.whatsappUrl !== "") {
        link.setAttribute("href", AB_CONFIG.whatsappUrl);
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
   * Appare dopo che la CTA hero è uscita dallo scroll superiore;
   * Scompare appena si entra nella sezione offerta o nel footer per evitare sovrapposizioni.
   */
  function setupStickyCta(root) {
    const stickyBar = root.querySelector(".ab-sticky-mobile-cta");
    const heroCta = root.querySelector("[data-hero-cta]");
    const offerSection = root.querySelector("#ab-sezione-offerta");
    const footer = root.querySelector("#ab-footer") || root.querySelector(".ab-footer");

    if (!stickyBar || !heroCta) return;

    if ("IntersectionObserver" in window) {
      let heroPassed = false;
      let endAreaReached = false;

      function updateStickyVisibility() {
        if (heroPassed && !endAreaReached) {
          stickyBar.classList.add("ab-sticky--visible");
        } else {
          stickyBar.classList.remove("ab-sticky--visible");
        }
      }

      // Osserva l'uscita della Hero CTA verso l'alto
      const heroObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
            updateStickyVisibility();
          });
        },
        { threshold: 0.1 }
      );
      heroObserver.observe(heroCta);

      // Osserva l'ingresso nella sezione offerta o nel footer
      const endElements = [offerSection, footer].filter(Boolean);
      const endObserver = new IntersectionObserver(
        function () {
          const anyIntersecting = endElements.some(function (el) {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
          });
          endAreaReached = anyIntersecting;
          updateStickyVisibility();
        },
        { threshold: 0.05 }
      );

      endElements.forEach(function (el) {
        endObserver.observe(el);
      });
    }
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

  // Hydration GHL e Fallback DOMContentLoaded per preview locale
  document.addEventListener("hydrationDone", initABPage, { once: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initABPage, { once: true });
  } else {
    initABPage();
  }
})();
