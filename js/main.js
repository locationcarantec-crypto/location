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
  },
  en: {
    captchaQuestion: (a, b) => "Anti-spam: what is " + a + " + " + b + "?",
    captchaWrong: "The anti-spam answer is incorrect, please try again.",
    sending: "Sending…",
    success: "Thank you! Your request has been sent, we'll get back to you shortly.",
    error: "Something went wrong. You can call us at +33 6 63 12 99 45 or try again.",
  },
  de: {
    captchaQuestion: (a, b) => "Anti-Spam: Wie viel ist " + a + " + " + b + "?",
    captchaWrong: "Die Anti-Spam-Antwort ist falsch, bitte versuchen Sie es erneut.",
    sending: "Wird gesendet…",
    success: "Vielen Dank! Ihre Anfrage wurde gesendet, wir melden uns in Kürze bei Ihnen.",
    error: "Ein Fehler ist aufgetreten. Sie können uns unter +33 6 63 12 99 45 anrufen oder es erneut versuchen.",
  },
  it: {
    captchaQuestion: (a, b) => "Anti-spam: quanto fa " + a + " + " + b + "?",
    captchaWrong: "La risposta anti-spam non è corretta, riprova.",
    sending: "Invio in corso…",
    success: "Grazie! La tua richiesta è stata inviata, ti risponderemo a breve.",
    error: "Si è verificato un errore. Puoi chiamarci al +33 6 63 12 99 45 o riprovare.",
  },
  es: {
    captchaQuestion: (a, b) => "Antispam: ¿cuánto es " + a + " + " + b + "?",
    captchaWrong: "La respuesta antispam es incorrecta, inténtalo de nuevo.",
    sending: "Enviando…",
    success: "¡Gracias! Tu solicitud ha sido enviada, te responderemos en breve.",
    error: "Se produjo un error. Puedes llamarnos al +33 6 63 12 99 45 o intentarlo de nuevo.",
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
});
