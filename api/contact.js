// /api/contact
// Reçoit le formulaire de contact/réservation (envoyé en JSON par js/main.js) et
// envoie DEUX emails via Resend (https://resend.com) :
//   1. Une notification à l'hôte (adresse ci-dessous), avec "Reply-To" réglé sur
//      l'adresse du client pour pouvoir répondre directement depuis sa boîte mail.
//   2. Un email de confirmation automatique envoyé au client, dans la langue de la
//      page sur laquelle il a rempli le formulaire, confirmant la bonne réception
//      de sa demande.
//
// Réglages requis sur Vercel : Project → Settings → Environment Variables
//   RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
//   (créée sur resend.com, après avoir vérifié le domaine chambresdhotesvuemer.com
//   dans Resend — voir README.md pour la procédure complète)

const OWNER_EMAIL = 'location.carantec@gmail.com';
const FROM_EMAIL = 'Vue Mer Carantec <reservation@chambresdhotesvuemer.com>';
const PHONE_DISPLAY = '06 63 12 99 45';
const PHONE_INTL = '+33 6 63 12 99 45';

const LANG_NAMES_FR = { fr: 'français', en: 'anglais', de: 'allemand', it: 'italien', es: 'espagnol' };

// Libellé du type de bien demandé (valeur du champ <select name="type_bien">),
// pour l'email de l'hôte (toujours en français) et pour l'email du client
// (traduit dans sa langue, voir T[lang].typeBien ci-dessous).
const TYPE_BIEN_FR = { room: 'Chambre vue mer', villa: 'Villa (semaine)', undecided: 'Indécis' };

const T = {
  fr: {
    subject: 'Nous avons bien reçu votre message — Vue Mer Carantec',
    greeting: (nom) => 'Bonjour ' + nom + ',',
    body: [
      "Merci pour votre message ! Nous vous confirmons que votre demande a bien été reçue.",
      "Nous revenons vers vous très rapidement pour vérifier les disponibilités et organiser votre séjour.",
      "Si votre demande est urgente, n'hésitez pas à nous appeler directement au " + PHONE_DISPLAY + ".",
    ],
    signoff: 'À très bientôt à Carantec,',
    team: "L'équipe de Vue Mer",
    recapTitle: 'Récapitulatif de votre demande :',
    fields: { telephone: 'Téléphone', typeBien: 'Type de bien', dates: 'Dates souhaitées', message: 'Message' },
    typeBien: { room: 'Chambre vue mer', villa: 'Villa (semaine)', undecided: 'Indécis' },
    noDates: 'dates non précisées',
  },
  en: {
    subject: "We've received your message — Vue Mer Carantec",
    greeting: (nom) => 'Hello ' + nom + ',',
    body: [
      'Thank you for your message! We confirm that your request has been received.',
      "We'll get back to you very shortly to check availability and organise your stay.",
      'If your request is urgent, feel free to call us directly at ' + PHONE_INTL + '.',
    ],
    signoff: 'See you soon in Carantec,',
    team: 'The Vue Mer team',
    recapTitle: 'Summary of your request:',
    fields: { telephone: 'Phone', typeBien: 'Type of stay', dates: 'Desired dates', message: 'Message' },
    typeBien: { room: 'Sea view room', villa: 'Villa (weekly)', undecided: 'Undecided' },
    noDates: 'dates not specified',
  },
  de: {
    subject: 'Wir haben Ihre Nachricht erhalten — Vue Mer Carantec',
    greeting: (nom) => 'Hallo ' + nom + ',',
    body: [
      'Vielen Dank für Ihre Nachricht! Wir bestätigen, dass Ihre Anfrage bei uns eingegangen ist.',
      'Wir melden uns sehr bald bei Ihnen, um die Verfügbarkeit zu prüfen und Ihren Aufenthalt zu organisieren.',
      'Bei dringenden Anfragen können Sie uns gerne direkt unter ' + PHONE_INTL + ' anrufen.',
    ],
    signoff: 'Bis bald in Carantec,',
    team: 'Das Vue Mer Team',
    recapTitle: 'Zusammenfassung Ihrer Anfrage:',
    fields: { telephone: 'Telefon', typeBien: 'Unterkunftstyp', dates: 'Gewünschte Daten', message: 'Nachricht' },
    typeBien: { room: 'Zimmer mit Meerblick', villa: 'Villa (Woche)', undecided: 'Noch unentschieden' },
    noDates: 'Daten nicht angegeben',
  },
  it: {
    subject: 'Abbiamo ricevuto il tuo messaggio — Vue Mer Carantec',
    greeting: (nom) => 'Ciao ' + nom + ',',
    body: [
      'Grazie per il tuo messaggio! Confermiamo che la tua richiesta è stata ricevuta.',
      'Ti risponderemo molto presto per verificare la disponibilità e organizzare il tuo soggiorno.',
      'Per richieste urgenti, non esitare a chiamarci direttamente al ' + PHONE_INTL + '.',
    ],
    signoff: 'A presto a Carantec,',
    team: 'Il team di Vue Mer',
    recapTitle: 'Riepilogo della tua richiesta:',
    fields: { telephone: 'Telefono', typeBien: 'Tipo di soggiorno', dates: 'Date desiderate', message: 'Messaggio' },
    typeBien: { room: 'Camera vista mare', villa: 'Villa (settimana)', undecided: 'Non deciso' },
    noDates: 'date non specificate',
  },
  es: {
    subject: 'Hemos recibido tu mensaje — Vue Mer Carantec',
    greeting: (nom) => 'Hola ' + nom + ',',
    body: [
      '¡Gracias por tu mensaje! Te confirmamos que hemos recibido tu solicitud.',
      'Te responderemos muy pronto para verificar la disponibilidad y organizar tu estancia.',
      'Si tu solicitud es urgente, no dudes en llamarnos directamente al ' + PHONE_INTL + '.',
    ],
    signoff: 'Hasta pronto en Carantec,',
    team: 'El equipo de Vue Mer',
    recapTitle: 'Resumen de tu solicitud:',
    fields: { telephone: 'Teléfono', typeBien: 'Tipo de alojamiento', dates: 'Fechas deseadas', message: 'Mensaje' },
    typeBien: { room: 'Habitación vista mar', villa: 'Villa (semana)', undecided: 'Aún sin decidir' },
    noDates: 'fechas no especificadas',
  },
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "RESEND_API_KEY n'est pas configurée sur Vercel." });
    return;
  }

  let data = req.body;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = {};
    }
  }
  data = data || {};

  // Honeypot anti-spam : champ caché normalement vide, rempli seulement par les robots.
  if (data._gotcha) {
    res.status(200).json({ ok: true });
    return;
  }

  // Anti-robot : un formulaire rempli en moins de 3 secondes est très probablement un bot.
  const ts = Number(data._ts);
  if (ts && Date.now() - ts < 3000) {
    res.status(200).json({ ok: true });
    return;
  }

  const nom = sanitize(data.nom);
  const telephone = sanitize(data.telephone);
  const email = sanitize(data.email);
  const dates = sanitize(data.dates);
  const message = sanitize(data.message);
  const typeBienKey = sanitize(data.type_bien);
  const lang = sanitize(data.lang).slice(0, 2) || 'fr';
  const t = T[lang] || T.fr;

  if (!nom || !email || !message || !isValidEmail(email)) {
    res.status(400).json({ error: 'Champs requis manquants ou invalides.' });
    return;
  }

  const typeBienFr = TYPE_BIEN_FR[typeBienKey] || null;
  const ownerSubject =
    nom + ' — ' + (typeBienFr || 'Type non précisé') + ' — ' + (dates || 'dates non précisées') + ' — Vue Mer Carantec';

  try {
    await sendEmail(apiKey, {
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      reply_to: email,
      subject: ownerSubject,
      html: ownerEmailHtml({ nom, telephone, email, dates, message, lang, typeBienFr }),
    });

    await sendEmail(apiKey, {
      from: FROM_EMAIL,
      to: email,
      reply_to: OWNER_EMAIL,
      subject: t.subject,
      html: clientEmailHtml({ nom, telephone, dates, message, t, typeBienKey }),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ error: String(err && err.message ? err.message : err) });
  }
};

function sanitize(v) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, 2000);
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// nl2br + échappement HTML pour le message libre du client
function formatMultiline(str) {
  return escapeHtml(str).replace(/\n/g, '<br>');
}

async function sendEmail(apiKey, payload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error('Resend error (' + response.status + '): ' + text);
  }
}

// ---------- Gabarits d'emails ----------

function emailShell(bodyHtml) {
  return (
    '<div style="font-family:Georgia,\'Times New Roman\',serif;background:#faf7f2;padding:32px 16px;">' +
    '<div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(27,58,75,0.08);">' +
    '<div style="background:#1b3a4b;padding:22px 28px;">' +
    '<span style="font-family:Georgia,serif;font-size:1.3rem;font-weight:700;color:#ffffff;letter-spacing:0.02em;">Vue Mer</span>' +
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:0.68rem;letter-spacing:0.14em;text-transform:uppercase;color:#e6b98c;margin-top:4px;">Chambres d\'hôtes &amp; Villa — Carantec</div>' +
    '</div>' +
    '<div style="padding:28px 28px 8px;font-family:Arial,Helvetica,sans-serif;color:#263238;font-size:0.98rem;line-height:1.6;">' +
    bodyHtml +
    '</div>' +
    '<div style="padding:18px 28px 26px;font-family:Arial,Helvetica,sans-serif;font-size:0.78rem;color:#5b6b70;border-top:1px solid #e3dccf;margin-top:14px;">' +
    '7 Impasse de Kerliezec, 29660 Carantec, Bretagne · ' + PHONE_DISPLAY +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

function recapTable(rows) {
  return (
    '<table style="width:100%;border-collapse:collapse;margin:14px 0;">' +
    rows
      .map(
        (r) =>
          '<tr>' +
          '<td style="padding:6px 10px 6px 0;color:#5b6b70;font-size:0.85rem;white-space:nowrap;vertical-align:top;">' + escapeHtml(r.label) + '</td>' +
          '<td style="padding:6px 0;color:#263238;font-size:0.92rem;">' + r.value + '</td>' +
          '</tr>'
      )
      .join('') +
    '</table>'
  );
}

function ownerEmailHtml({ nom, telephone, email, dates, message, lang, typeBienFr }) {
  const langNote = LANG_NAMES_FR[lang] ? ' (formulaire rempli en ' + LANG_NAMES_FR[lang] + ')' : '';
  const rows = [
    { label: 'Nom', value: escapeHtml(nom) },
    { label: 'Email', value: '<a href="mailto:' + escapeHtml(email) + '" style="color:#a86f45;">' + escapeHtml(email) + '</a>' },
  ];
  if (telephone) rows.push({ label: 'Téléphone', value: '<a href="tel:' + escapeHtml(telephone) + '" style="color:#a86f45;">' + escapeHtml(telephone) + '</a>' });
  if (typeBienFr) rows.push({ label: 'Type de bien', value: escapeHtml(typeBienFr) });
  if (dates) rows.push({ label: 'Dates souhaitées', value: escapeHtml(dates) });

  return emailShell(
    '<p style="margin:0 0 14px;font-size:1.05rem;">Nouvelle demande de réservation' + langNote + '</p>' +
    recapTable(rows) +
    '<p style="margin:16px 0 6px;color:#5b6b70;font-size:0.85rem;">Message :</p>' +
    '<p style="margin:0;padding:14px 16px;background:#faf7f2;border-radius:6px;">' + formatMultiline(message) + '</p>' +
    '<p style="margin:20px 0 0;font-size:0.85rem;color:#5b6b70;">Vous pouvez répondre directement à cet email pour contacter ' + escapeHtml(nom) + '.</p>'
  );
}

function clientEmailHtml({ nom, telephone, dates, message, t, typeBienKey }) {
  const rows = [];
  if (telephone) rows.push({ label: t.fields.telephone, value: escapeHtml(telephone) });
  const typeBienLabel = t.typeBien[typeBienKey];
  if (typeBienLabel) rows.push({ label: t.fields.typeBien, value: escapeHtml(typeBienLabel) });
  if (dates) rows.push({ label: t.fields.dates, value: escapeHtml(dates) });
  rows.push({ label: t.fields.message, value: formatMultiline(message) });

  return emailShell(
    '<p style="margin:0 0 14px;">' + t.greeting(escapeHtml(nom)) + '</p>' +
    t.body.map((p) => '<p style="margin:0 0 14px;">' + escapeHtml(p) + '</p>').join('') +
    '<p style="margin:20px 0 6px;font-weight:bold;color:#1b3a4b;">' + escapeHtml(t.recapTitle) + '</p>' +
    recapTable(rows) +
    '<p style="margin:22px 0 0;">' + escapeHtml(t.signoff) + '<br>' + escapeHtml(t.team) + '</p>'
  );
}
