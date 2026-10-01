/**
 * CHECK-UP DI MOBILITÀ — JAVASCRIPT LOGIC
 * GoHighLevel Compatible & Resilient Script
 * Scoped inside #ab-mobility-checkup
 */

const AB_CONFIG = {
  checkoutUrl: "#CHECKOUT_URL",
  whatsappUrl: "#WHATSAPP_URL",
  deadlineISO: "", // Lasciare vuoto se non c'è una data precisa. Il timer rimarrà nascosto senza mostrare zeri.
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

    // 1. Configurazione dinamica dei link
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
   * Valorizza tutti i link CTA con gli URL di configurazione
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

    // Aggiornamento prezzi e posti
    const promoElements = root.querySelectorAll("[data-promo-price]");
    promoElements.forEach(function (el) {
      el.textContent = AB_CONFIG.promoPrice;
    });

    const regularElements = root.querySelectorAll("[data-regular-price]");
    regularElements.forEach(function (el) {
      el.textContent = AB_CONFIG.regularPrice;
    });

    const spotsElements = root.querySelectorAll("[data-spots-available]");
    spotsElements.forEach(function (el) {
      el.textContent = AB_CONFIG.availableSpots;
    });
  }

  /**
   * Gestione rigorosa del countdown:
   * Se deadlineISO è vuoto, invalido o già scaduto -> nasconde completamente gli elementi
   */
  function setupCountdown(root) {
    const topBar = root.querySelector(".ab-top-bar");
    const offerCountdownWrap = root.querySelector("[data-countdown-wrap]");

    if (!AB_CONFIG.deadlineISO || AB_CONFIG.deadlineISO.trim() === "") {
      if (topBar) topBar.classList.add("ab-top-bar--hidden");
      if (offerCountdownWrap) offerCountdownWrap.style.display = "none";
      return;
    }

    const targetDate = new Date(AB_CONFIG.deadlineISO).getTime();
    if (isNaN(targetDate)) {
      if (topBar) topBar.classList.add("ab-top-bar--hidden");
      if (offerCountdownWrap) offerCountdownWrap.style.display = "none";
      return;
    }

    function updateTimer() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (topBar) topBar.classList.add("ab-top-bar--hidden");
        if (offerCountdownWrap) offerCountdownWrap.style.display = "none";
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const timeString = 
        String(hours).padStart(2, "0") + "h " +
        String(minutes).padStart(2, "0") + "m " +
        String(seconds).padStart(2, "0") + "s";

      const timerDisplays = root.querySelectorAll("[data-countdown-display]");
      timerDisplays.forEach(function (display) {
        display.textContent = timeString;
      });
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /**
   * Sticky CTA Mobile:
   * Appare dopo che la CTA hero è uscita dallo schermo, scompare vicino all'offerta finale o al footer
   */
  function setupStickyCta(root) {
    const stickyBar = root.querySelector(".ab-sticky-mobile-cta");
    const heroCta = root.querySelector("[data-hero-cta]");
    const offerSection = root.querySelector("#ab-sezione-offerta");

    if (!stickyBar || !heroCta) return;

    if ("IntersectionObserver" in window) {
      let heroPassed = false;
      let offerReached = false;

      function updateStickyVisibility() {
        if (heroPassed && !offerReached) {
          stickyBar.classList.add("ab-sticky--visible");
        } else {
          stickyBar.classList.remove("ab-sticky--visible");
        }
      }

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

      if (offerSection) {
        const offerObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              offerReached = entry.isIntersecting;
              updateStickyVisibility();
            });
          },
          { threshold: 0.1 }
        );
        offerObserver.observe(offerSection);
      }
    }
  }

  /**
   * GSAP Progressive Enhancement:
   * Solo le 4 aree consentite:
   * 1. Hero composta
   * 2. Linea step percorso
   * 3. Reveal Mappa
   * 4. Reveal selettivo gruppi
   */
  function setupGsapAnimations(root) {
    if (typeof window.gsap === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    try {
      // 1. Entrata hero composta
      gsap.from(root.querySelectorAll(".ab-hero__content > *"), {
        opacity: 0,
        y: 18,
        duration: 0.65,
        stagger: 0.1,
        ease: "power2.out"
      });

      // Se ScrollTrigger è disponibile, attiva reveal per le altre 3 aree
      if (typeof window.ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // 2. Linea step percorso
        gsap.from(root.querySelectorAll(".ab-step-card"), {
          scrollTrigger: {
            trigger: root.querySelector(".ab-steps-grid"),
            start: "top 80%"
          },
          opacity: 0,
          y: 24,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out"
        });

        // 3. Reveal Mappa del Movimento
        gsap.from(root.querySelector(".ab-map-mockup-wrapper"), {
          scrollTrigger: {
            trigger: root.querySelector(".ab-map-hero"),
            start: "top 75%"
          },
          opacity: 0,
          scale: 0.96,
          duration: 0.8,
          ease: "power2.out"
        });

        // 4. Reveal selettivo card offerta
        gsap.from(root.querySelector(".ab-offer-box"), {
          scrollTrigger: {
            trigger: root.querySelector(".ab-offer-box"),
            start: "top 80%"
          },
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: "power2.out"
        });
      }
    } catch (e) {
      console.warn("[Check-up Mobilità] GSAP init warning:", e);
    }
  }

  // Supporto Hydration GHL e Fallback DOMContentLoaded
  document.addEventListener("hydrationDone", initABPage, { once: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initABPage, { once: true });
  } else {
    initABPage();
  }
})();
