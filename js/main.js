// Chambres d'hôtes Vue Mer — script principal
// Petit dictionnaire i18n pour les textes générés dynamiquement (captcha,
// statuts du formulaire). La langue est lue depuis <html lang="...">.
const I18N_MAIN = {
  fr: {
    captchaQuestion: (a, b) => "Anti-spam : combien font " + a + " + " + b + " ?",
    captchaWrong: "La réponse anti-spam est incorrecte, merci de réessayer.",
    sending: "Envoi en cours…",
    success: "Merci ! Votre demande a bien été envoyée, nous revenons vers vous rapidement.",
    error: "Une erreur est survenue. Vous pouvez nous appeler au 06 63 12 99 45 ou réessayer.",
    callLabel: "Appelez-nous : 06 63 12 99 45",
    whatsappLabel: "Contactez-nous sur WhatsApp",
    whatsappMessage: "Bonjour, je vous contacte au sujet d'un séjour à Vue Mer Carantec.",
    popupEyebrow: "Villa et chambres vue mer · Carantec",
    popupTitle: "Pour les meilleurs prix et disponibilités",
    popupText: "Contactez-nous directement, sans intermédiaire. Nous répondons rapidement.",
    popupPhone: "Téléphone",
    popupSms: "SMS",
    popupWhatsapp: "WhatsApp",
    popupClose: "Fermer",
  },
  en: {
    captchaQuestion: (a, b) => "Anti-spam: what is " + a + " + " + b + "?",
    captchaWrong: "The anti-spam answer is incorrect, please try again.",
    sending: "Sending…",
    success: "Thank you! Your request has been sent, we'll get back to you shortly.",
    error: "Something went wrong. You can call us at +33 6 63 12 99 45 or try again.",
    callLabel: "Call us: +33 6 63 12 99 45",
    whatsappLabel: "Contact us on WhatsApp",
    whatsappMessage: "Hello, I'm getting in touch about a stay at Vue Mer Carantec.",
    popupEyebrow: "Villa and sea-view rooms · Carantec",
    popupTitle: "For the best rates and availability",
    popupText: "Contact us directly, with no middleman. We reply quickly.",
    popupPhone: "Call",
    popupSms: "Text",
    popupWhatsapp: "WhatsApp",
    popupClose: "Close",
  },
  de: {
    captchaQuestion: (a, b) => "Anti-Spam: Wie viel ist " + a + " + " + b + "?",
    captchaWrong: "Die Anti-Spam-Antwort ist falsch, bitte versuchen Sie es erneut.",
    sending: "Wird gesendet…",
    success: "Vielen Dank! Ihre Anfrage wurde gesendet, wir melden uns in Kürze bei Ihnen.",
    error: "Ein Fehler ist aufgetreten. Sie können uns unter +33 6 63 12 99 45 anrufen oder es erneut versuchen.",
    callLabel: "Rufen Sie uns an: +33 6 63 12 99 45",
    whatsappLabel: "Kontaktieren Sie uns über WhatsApp",
    whatsappMessage: "Hallo, ich melde mich wegen eines Aufenthalts bei Vue Mer Carantec.",
    popupEyebrow: "Villa und Zimmer mit Meerblick · Carantec",
    popupTitle: "Für beste Preise und Verfügbarkeiten",
    popupText: "Kontaktieren Sie uns direkt, ohne Vermittler. Wir antworten schnell.",
    popupPhone: "Anrufen",
    popupSms: "SMS",
    popupWhatsapp: "WhatsApp",
    popupClose: "Schließen",
  },
  it: {
    captchaQuestion: (a, b) => "Anti-spam: quanto fa " + a + " + " + b + "?",
    captchaWrong: "La risposta anti-spam non è corretta, riprova.",
    sending: "Invio in corso…",
    success: "Grazie! La tua richiesta è stata inviata, ti risponderemo a breve.",
    error: "Si è verificato un errore. Puoi chiamarci al +33 6 63 12 99 45 o riprovare.",
    callLabel: "Chiamaci: +33 6 63 12 99 45",
    whatsappLabel: "Contattaci su WhatsApp",
    whatsappMessage: "Ciao, vi contatto per un soggiorno a Vue Mer Carantec.",
    popupEyebrow: "Villa e camere vista mare · Carantec",
    popupTitle: "Per i migliori prezzi e disponibilità",
    popupText: "Contattaci direttamente, senza intermediari. Rispondiamo rapidamente.",
    popupPhone: "Telefono",
    popupSms: "SMS",
    popupWhatsapp: "WhatsApp",
    popupClose: "Chiudi",
  },
  es: {
    captchaQuestion: (a, b) => "Antispam: ¿cuánto es " + a + " + " + b + "?",
    captchaWrong: "La respuesta antispam es incorrecta, inténtalo de nuevo.",
    sending: "Enviando…",
    success: "¡Gracias! Tu solicitud ha sido enviada, te responderemos en breve.",
    error: "Se produjo un error. Puedes llamarnos al +33 6 63 12 99 45 o intentarlo de nuevo.",
    callLabel: "Llámanos: +33 6 63 12 99 45",
    whatsappLabel: "Contáctanos por WhatsApp",
    whatsappMessage: "Hola, os escribo por una estancia en Vue Mer Carantec.",
    popupEyebrow: "Villa y habitaciones vista al mar · Carantec",
    popupTitle: "Para los mejores precios y disponibilidad",
    popupText: "Contáctanos directamente, sin intermediarios. Respondemos rápido.",
    popupPhone: "Teléfono",
    popupSms: "SMS",
    popupWhatsapp: "WhatsApp",
    popupClose: "Cerrar",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const pageLang = (document.documentElement.lang || "fr").slice(0, 2);
  const t = I18N_MAIN[pageLang] || I18N_MAIN.fr;

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  // Header background on scroll
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav toggle
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-locked");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("is-open"));
    });
  }

  // Sélecteur de langue : ferme le menu ouvert si on clique ailleurs
  const langSwitch = document.querySelector(".lang-switch");
  if (langSwitch) {
    document.addEventListener("click", (e) => {
      if (langSwitch.hasAttribute("open") && !langSwitch.contains(e.target)) {
        langSwitch.removeAttribute("open");
      }
    });
  }

  // Lightbox gallery
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    document.querySelectorAll(".gallery img").forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.dataset.full || img.src;
        lightbox.classList.add("is-open");
      });
    });
    lightbox.addEventListener("click", () => lightbox.classList.remove("is-open"));
    const closeBtn = lightbox.querySelector(".lightbox-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        lightbox.classList.remove("is-open");
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") lightbox.classList.remove("is-open");
    });
  }

  // Pré-remplissage du champ "Dates souhaitées" depuis le calendrier de disponibilités
  // (lien du type contact.html?dates=du%2012%20au%2019%20juillet)
  const datesField = document.getElementById("dates");
  if (datesField) {
    const params = new URLSearchParams(window.location.search);
    const datesParam = params.get("dates");
    if (datesParam) {
      datesField.value = datesParam;
    }
  }

  // Contact form handler — envoi réel par email via notre propre fonction Vercel
  // /api/contact (Resend), vers location.carantec@gmail.com, avec confirmation
  // automatique envoyée au client. Voir README.md pour la configuration.
  const form = document.querySelector(".contact-form");
  if (form) {
    const statusEl = form.querySelector(".form-status");

    // Horodatage de chargement du formulaire, utilisé côté serveur comme
    // protection anti-robot additionnelle (un envoi trop rapide est suspect).
    const tsField = form.querySelector('input[name="_ts"]');
    if (tsField) tsField.value = String(Date.now());

    // Anti-spam : petit captcha maison (question mathématique simple),
    // en complément du champ piège (_gotcha) et de la protection anti-robot serveur.
    const captchaLabel = form.querySelector("#captcha-label");
    const captchaInput = form.querySelector("#captcha");
    let captchaAnswer = null;

    function newCaptchaQuestion() {
      const a = 1 + Math.floor(Math.random() * 9);
      const b = 1 + Math.floor(Math.random() * 9);
      captchaAnswer = a + b;
      if (captchaLabel) captchaLabel.textContent = t.captchaQuestion(a, b);
      if (captchaInput) captchaInput.value = "";
    }
    if (captchaLabel && captchaInput) newCaptchaQuestion();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (captchaInput && parseInt(captchaInput.value, 10) !== captchaAnswer) {
        if (statusEl) {
          statusEl.textContent = t.captchaWrong;
          statusEl.style.color = "#b3261e";
        }
        newCaptchaQuestion();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (statusEl) {
        statusEl.textContent = t.sending;
        statusEl.style.color = "var(--color-text-muted)";
      }
      if (submitBtn) submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        const payload = {};
        formData.forEach((value, key) => {
          payload[key] = value;
        });
        payload.lang = pageLang;

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          form.reset();
          newCaptchaQuestion();
          if (tsField) tsField.value = String(Date.now());
          if (statusEl) {
            statusEl.textContent = t.success;
            statusEl.style.color = "#2f7a4d";
          }
        } else {
          throw new Error("Erreur d'envoi");
        }
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = t.error;
          statusEl.style.color = "#b3261e";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Fade-in on scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Suivi Google Analytics : clics tél/WhatsApp + envoi du formulaire de contact
  if (typeof gtag === "function") {
    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      link.addEventListener("click", () => {
        gtag("event", "phone_click", { link_url: link.getAttribute("href") });
      });
    });
    document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
      link.addEventListener("click", () => {
        gtag("event", "whatsapp_click", { link_url: link.getAttribute("href") });
      });
    });
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", () => {
        gtag("event", "contact_form_submit");
      });
    }
  }

  // Onglets de la galerie photo (Villa / Chambres / Piscine)
  const galleryTabs = document.querySelectorAll(".gallery-tab");
  if (galleryTabs.length) {
    const panels = document.querySelectorAll(".gallery-panel");
    galleryTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tabTarget;
        galleryTabs.forEach((t) => t.classList.toggle("is-active", t === tab));
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.tabPanel !== target;
        });
      });
    });
  }

  // Bouton de contact flottant permanent (appel + WhatsApp), présent sur
  // toutes les pages et toutes les langues via ce script partagé.
  const floating = document.createElement("div");
  floating.className = "floating-contact";
  floating.innerHTML = `
    <a class="floating-contact__btn floating-contact__btn--whatsapp" href="https://wa.me/33663129945?text=${encodeURIComponent(t.whatsappMessage)}" target="_blank" rel="noopener" aria-label="${t.whatsappLabel}" title="${t.whatsappLabel}">
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 2.67C8.7 2.67 2.75 8.61 2.75 15.96c0 2.45.66 4.75 1.8 6.73L2.67 29.33l6.82-1.79a13.2 13.2 0 0 0 6.55 1.75h.01c7.34 0 13.29-5.95 13.29-13.29 0-3.55-1.38-6.89-3.89-9.4a13.2 13.2 0 0 0-9.4-3.93zm0 2.42c2.9 0 5.63 1.13 7.68 3.19a10.82 10.82 0 0 1 3.18 7.68c0 6-4.88 10.87-10.87 10.87a10.9 10.9 0 0 1-5.55-1.52l-.4-.24-4.05 1.06 1.08-3.95-.26-.41a10.83 10.83 0 0 1-1.68-5.81c0-6 4.88-10.87 10.87-10.87zm-5.98 6.03c-.22 0-.58.08-.89.42-.3.34-1.16 1.13-1.16 2.77 0 1.63 1.19 3.2 1.36 3.43.17.22 2.32 3.62 5.72 4.93 2.83 1.1 3.41.88 4.02.83.61-.06 1.98-.81 2.26-1.6.28-.78.28-1.45.2-1.6-.09-.14-.31-.22-.65-.39-.34-.17-1.98-.98-2.29-1.09-.31-.11-.53-.17-.76.17-.22.34-.87 1.09-1.06 1.32-.2.22-.39.25-.73.08-.34-.17-1.42-.52-2.71-1.67-1-.9-1.68-2-1.87-2.34-.2-.34-.02-.52.15-.69.15-.15.34-.39.5-.59.17-.2.22-.34.34-.56.11-.22.06-.42-.03-.59-.08-.17-.75-1.85-1.06-2.52-.27-.6-.55-.56-.76-.57-.2-.01-.42-.01-.63-.01z"/></svg>
    </a>
    <a class="floating-contact__btn floating-contact__btn--call" href="tel:+33663129945" aria-label="${t.callLabel}" title="${t.callLabel}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    </a>
  `;
  document.body.appendChild(floating);

  // Popup de contact : 20 s apres l'arrivee, une seule fois, memorise 30 jours.
  (function contactPopup() {
    var CLE = "vuemer_popup_contact";
    var JOURS = 30;
    var DELAI = 20000;

    var dejaVu = false;
    try {
      var enregistre = window.localStorage.getItem(CLE);
      if (enregistre && Date.now() - parseInt(enregistre, 10) < JOURS * 864e5) dejaVu = true;
    } catch (e) {}
    if (dejaVu) return;

    var minuteur = window.setTimeout(afficher, DELAI);

    function memoriser() {
      try { window.localStorage.setItem(CLE, String(Date.now())); } catch (e) {}
    }

    function afficher() {
      var overlay = document.createElement("div");
      overlay.className = "contact-popup";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", t.popupTitle);
      overlay.innerHTML =
        '<div class="contact-popup__box">' +
          '<button type="button" class="contact-popup__close" aria-label="' + t.popupClose + '">&times;</button>' +
          '<p class="contact-popup__eyebrow">' + t.popupEyebrow + '</p>' +
          '<h2 class="contact-popup__title">' + t.popupTitle + '</h2>' +
          '<p class="contact-popup__text">' + t.popupText + '</p>' +
          '<div class="contact-popup__actions">' +
            '<a class="contact-popup__cta contact-popup__cta--phone" href="tel:+33663129945" data-canal="phone">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
              '<span>' + t.popupPhone + '</span>' +
            '</a>' +
            '<a class="contact-popup__cta contact-popup__cta--sms" href="sms:+33663129945" data-canal="sms">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
              '<span>' + t.popupSms + '</span>' +
            '</a>' +
            '<a class="contact-popup__cta contact-popup__cta--whatsapp" href="https://wa.me/33663129945?text=' + encodeURIComponent(t.whatsappMessage) + '" target="_blank" rel="noopener" data-canal="whatsapp">' +
              '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 2.67C8.7 2.67 2.75 8.61 2.75 15.96c0 2.45.66 4.75 1.8 6.73L2.67 29.33l6.82-1.79a13.2 13.2 0 0 0 6.55 1.75h.01c7.34 0 13.29-5.95 13.29-13.29 0-3.55-1.38-6.89-3.89-9.4a13.2 13.2 0 0 0-9.4-3.93zm0 2.42c2.9 0 5.63 1.13 7.68 3.19a10.82 10.82 0 0 1 3.18 7.68c0 6-4.88 10.87-10.87 10.87a10.9 10.9 0 0 1-5.55-1.52l-.4-.24-4.05 1.06 1.08-3.95-.26-.41a10.83 10.83 0 0 1-1.68-5.81c0-6 4.88-10.87 10.87-10.87zm-5.98 6.03c-.22 0-.58.08-.89.42-.3.34-1.16 1.13-1.16 2.77 0 1.63 1.19 3.2 1.36 3.43.17.22 2.32 3.62 5.72 4.93 2.83 1.1 3.41.88 4.02.83.61-.06 1.98-.81 2.26-1.6.28-.78.28-1.45.2-1.6-.09-.14-.31-.22-.65-.39-.34-.17-1.98-.98-2.29-1.09-.31-.11-.53-.17-.76.17-.22.34-.87 1.09-1.06 1.32-.2.22-.39.25-.73.08-.34-.17-1.42-.52-2.71-1.67-1-.9-1.68-2-1.87-2.34-.2-.34-.02-.52.15-.69.15-.15.34-.39.5-.59.17-.2.22-.34.34-.56.11-.22.06-.42-.03-.59-.08-.17-.75-1.85-1.06-2.52-.27-.6-.55-.56-.76-.57-.2-.01-.42-.01-.63-.01z"/></svg>' +
              '<span>' + t.popupWhatsapp + '</span>' +
            '</a>' +
          '</div>' +
          '<p class="contact-popup__phone">06 63 12 99 45</p>' +
        '</div>';

      document.body.appendChild(overlay);
      memoriser();
      window.requestAnimationFrame(function () { overlay.classList.add("is-visible"); });

      if (typeof gtag === "function") gtag("event", "contact_popup_view");

      overlay.querySelectorAll(".contact-popup__cta").forEach(function (lien) {
        lien.addEventListener("click", function () {
          if (typeof gtag === "function") {
            gtag("event", "contact_popup_click", { canal: lien.dataset.canal });
          }
        });
      });

      function fermer() {
        overlay.classList.remove("is-visible");
        document.removeEventListener("keydown", surEchap);
        window.setTimeout(function () { overlay.remove(); }, 250);
      }
      function surEchap(ev) { if (ev.key === "Escape") fermer(); }

      overlay.querySelector(".contact-popup__close").addEventListener("click", fermer);
      overlay.addEventListener("click", function (ev) { if (ev.target === overlay) fermer(); });
      document.addEventListener("keydown", surEchap);
      overlay.querySelector(".contact-popup__close").focus();
    }

    window.addEventListener("pagehide", function () { window.clearTimeout(minuteur); });
  })();
});
