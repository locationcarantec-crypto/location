// Calendrier de disponibilités — Vue Mer
// Récupère les dates occupées via /api/availability et affiche un
// calendrier interactif. Le visiteur peut sélectionner une période
// disponible pour pré-remplir le formulaire de contact — il ne peut
// pas réserver directement.

(function () {
  const I18N_CAL = {
    fr: {
      months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      weekdays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      free: 'Disponible',
      busy: 'Indisponible',
      selection: 'Votre sélection',
      loading: 'Chargement des disponibilités…',
      loadError: 'Impossible de charger le calendrier pour le moment. Contactez-nous directement pour vérifier les disponibilités.',
      arrival: (d) => 'Arrivée le <strong>' + d + '</strong> — sélectionnez une date de départ.',
      reset: 'Réinitialiser',
      stay: (s, e) => 'Séjour du <strong>' + s + '</strong> au <strong>' + e + '</strong>',
      request: 'Faire une demande pour ces dates',
      dateJoin: 'au',
      prevLabel: 'Mois précédent',
      nextLabel: 'Mois suivant',
    },
    en: {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      free: 'Available',
      busy: 'Unavailable',
      selection: 'Your selection',
      loading: 'Loading availability…',
      loadError: 'Unable to load the calendar right now. Please contact us directly to check availability.',
      arrival: (d) => 'Arrival on <strong>' + d + '</strong> — select a departure date.',
      reset: 'Reset',
      stay: (s, e) => 'Stay from <strong>' + s + '</strong> to <strong>' + e + '</strong>',
      request: 'Request these dates',
      dateJoin: 'to',
      prevLabel: 'Previous month',
      nextLabel: 'Next month',
    },
    de: {
      months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      free: 'Verfügbar',
      busy: 'Nicht verfügbar',
      selection: 'Ihre Auswahl',
      loading: 'Verfügbarkeit wird geladen…',
      loadError: 'Der Kalender kann derzeit nicht geladen werden. Bitte kontaktieren Sie uns direkt, um die Verfügbarkeit zu prüfen.',
      arrival: (d) => 'Anreise am <strong>' + d + '</strong> — wählen Sie ein Abreisedatum.',
      reset: 'Zurücksetzen',
      stay: (s, e) => 'Aufenthalt vom <strong>' + s + '</strong> bis <strong>' + e + '</strong>',
      request: 'Für diese Termine anfragen',
      dateJoin: 'bis',
      prevLabel: 'Vorheriger Monat',
      nextLabel: 'Nächster Monat',
    },
    it: {
      months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
      weekdays: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
      free: 'Disponibile',
      busy: 'Non disponibile',
      selection: 'La tua selezione',
      loading: 'Caricamento disponibilità…',
      loadError: 'Impossibile caricare il calendario al momento. Contattaci direttamente per verificare la disponibilità.',
      arrival: (d) => 'Arrivo il <strong>' + d + '</strong> — seleziona una data di partenza.',
      reset: 'Reimposta',
      stay: (s, e) => 'Soggiorno dal <strong>' + s + '</strong> al <strong>' + e + '</strong>',
      request: 'Richiedi queste date',
      dateJoin: 'al',
      prevLabel: 'Mese precedente',
      nextLabel: 'Mese successivo',
    },
    es: {
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      free: 'Disponible',
      busy: 'No disponible',
      selection: 'Tu selección',
      loading: 'Cargando disponibilidad…',
      loadError: 'No se puede cargar el calendario en este momento. Contáctanos directamente para consultar la disponibilidad.',
      arrival: (d) => 'Llegada el <strong>' + d + '</strong> — selecciona una fecha de salida.',
      reset: 'Restablecer',
      stay: (s, e) => 'Estancia del <strong>' + s + '</strong> al <strong>' + e + '</strong>',
      request: 'Solicitar estas fechas',
      dateJoin: 'al',
      prevLabel: 'Mes anterior',
      nextLabel: 'Mes siguiente',
    },
  };

  const pageLang = (document.documentElement.lang || 'fr').slice(0, 2);
  const T = I18N_CAL[pageLang] || I18N_CAL.fr;

  function pad(n) { return String(n).padStart(2, '0'); }
  function toKey(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function toFrDate(y, m, d) { return pad(d) + '/' + pad(m + 1) + '/' + y; }

  function expandBusyDates(ranges) {
    const busy = new Set();
    ranges.forEach((r) => {
      const start = new Date(r.start + 'T00:00:00');
      const end = new Date(r.end + 'T00:00:00'); // exclusif (norme iCal)
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        busy.add(toKey(d.getFullYear(), d.getMonth(), d.getDate()));
      }
    });
    return busy;
  }

  function initCalendar(root) {
    const state = {
      busy: new Set(),
      loaded: false,
      error: false,
      viewYear: new Date().getFullYear(),
      viewMonth: new Date().getMonth(),
      selStart: null, // 'YYYY-MM-DD'
      selEnd: null,
    };

    const todayKey = (() => {
      const t = new Date();
      return toKey(t.getFullYear(), t.getMonth(), t.getDate());
    })();

    root.innerHTML =
      '<div class="avail-cal">' +
      '<div class="avail-cal__header">' +
      '<button type="button" class="avail-cal__nav" data-nav="prev" aria-label="' + T.prevLabel + '">&larr;</button>' +
      '<div class="avail-cal__title"></div>' +
      '<button type="button" class="avail-cal__nav" data-nav="next" aria-label="' + T.nextLabel + '">&rarr;</button>' +
      '</div>' +
      '<div class="avail-cal__weekdays"></div>' +
      '<div class="avail-cal__grid"></div>' +
      '<div class="avail-cal__legend">' +
      '<span><i class="avail-dot avail-dot--free"></i> ' + T.free + '</span>' +
      '<span><i class="avail-dot avail-dot--busy"></i> ' + T.busy + '</span>' +
      '<span><i class="avail-dot avail-dot--sel"></i> ' + T.selection + '</span>' +
      '</div>' +
      '<div class="avail-cal__summary" hidden></div>' +
      '</div>';

    const titleEl = root.querySelector('.avail-cal__title');
    const weekdaysEl = root.querySelector('.avail-cal__weekdays');
    const gridEl = root.querySelector('.avail-cal__grid');
    const summaryEl = root.querySelector('.avail-cal__summary');
    const prevBtn = root.querySelector('[data-nav="prev"]');
    const nextBtn = root.querySelector('[data-nav="next"]');

    T.weekdays.forEach((w) => {
      const el = document.createElement('span');
      el.textContent = w;
      weekdaysEl.appendChild(el);
    });

    prevBtn.addEventListener('click', () => {
      state.viewMonth -= 1;
      if (state.viewMonth < 0) { state.viewMonth = 11; state.viewYear -= 1; }
      render();
    });
    nextBtn.addEventListener('click', () => {
      state.viewMonth += 1;
      if (state.viewMonth > 11) { state.viewMonth = 0; state.viewYear += 1; }
      render();
    });

    function isBeforeCurrentMonth() {
      const now = new Date();
      return state.viewYear < now.getFullYear() ||
        (state.viewYear === now.getFullYear() && state.viewMonth <= now.getMonth());
    }

    function render() {
      titleEl.textContent = T.months[state.viewMonth] + ' ' + state.viewYear;
      prevBtn.disabled = isBeforeCurrentMonth();

      gridEl.innerHTML = '';

      const firstOfMonth = new Date(state.viewYear, state.viewMonth, 1);
      // Lundi = 0 ... Dimanche = 6
      const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
      const daysInMonth = new Date(state.viewYear, state.viewMonth + 1, 0).getDate();

      for (let i = 0; i < leadingBlanks; i++) {
        const blank = document.createElement('span');
        blank.className = 'avail-day avail-day--blank';
        gridEl.appendChild(blank);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const key = toKey(state.viewYear, state.viewMonth, d);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'avail-day';
        btn.textContent = String(d);

        const isPast = key < todayKey;
        const isBusy = state.busy.has(key);
        const inRange = state.selStart && state.selEnd && key > state.selStart && key < state.selEnd;
        const isEdge = key === state.selStart || key === state.selEnd;

        if (isPast) btn.classList.add('avail-day--past');
        if (isBusy && !isPast) btn.classList.add('avail-day--busy');
        if (!isPast && !isBusy) btn.classList.add('avail-day--free');
        if (key === todayKey) btn.classList.add('avail-day--today');
        if (inRange) btn.classList.add('avail-day--in-range');
        if (isEdge) btn.classList.add('avail-day--selected');

        if (isPast || isBusy) {
          btn.disabled = true;
        } else {
          btn.addEventListener('click', () => onDayClick(key));
        }

        gridEl.appendChild(btn);
      }

      renderSummary();
    }

    function rangeHasBusyOrPast(startKey, endKey) {
      const start = new Date(startKey + 'T00:00:00');
      const end = new Date(endKey + 'T00:00:00');
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const k = toKey(d.getFullYear(), d.getMonth(), d.getDate());
        if (k < todayKey || state.busy.has(k)) return true;
      }
      return false;
    }

    function onDayClick(key) {
      if (!state.selStart || (state.selStart && state.selEnd)) {
        // nouvelle sélection
        state.selStart = key;
        state.selEnd = null;
      } else if (key <= state.selStart) {
        state.selStart = key;
        state.selEnd = null;
      } else if (rangeHasBusyOrPast(state.selStart, key)) {
        // la période contient une date indisponible : on repart de cette date
        state.selStart = key;
        state.selEnd = null;
      } else {
        state.selEnd = key;
      }
      render();
    }

    function renderSummary() {
      if (!state.selStart) {
        summaryEl.hidden = true;
        summaryEl.innerHTML = '';
        return;
      }
      summaryEl.hidden = false;

      const [sy, sm, sd] = state.selStart.split('-').map(Number);
      const startFr = toFrDate(sy, sm - 1, sd);

      if (!state.selEnd) {
        summaryEl.innerHTML =
          '<p>' + T.arrival(startFr) + '</p>' +
          '<button type="button" class="btn btn--dark avail-cal__reset">' + T.reset + '</button>';
      } else {
        const [ey, em, ed] = state.selEnd.split('-').map(Number);
        const endFr = toFrDate(ey, em - 1, ed);
        const dates = startFr + ' ' + T.dateJoin + ' ' + endFr;
        const url = 'contact.html?dates=' + encodeURIComponent(dates);
        summaryEl.innerHTML =
          '<p>' + T.stay(startFr, endFr) + '</p>' +
          '<div class="avail-cal__actions">' +
          '<a href="' + url + '" class="btn btn--primary">' + T.request + '</a>' +
          '<button type="button" class="btn btn--dark avail-cal__reset">' + T.reset + '</button>' +
          '</div>';
      }

      const resetBtn = summaryEl.querySelector('.avail-cal__reset');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.selStart = null;
          state.selEnd = null;
          render();
        });
      }
    }

    function renderMessage(text) {
      gridEl.innerHTML = '<p class="avail-cal__message">' + text + '</p>';
    }

    renderMessage(T.loading);

    fetch('/api/availability')
      .then((r) => r.json())
      .then((data) => {
        state.busy = expandBusyDates(data.ranges || []);
        state.loaded = true;
        render();
      })
      .catch(() => {
        state.error = true;
        renderMessage(T.loadError);
      });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-availability-calendar]').forEach(initCalendar);
  });
})();
