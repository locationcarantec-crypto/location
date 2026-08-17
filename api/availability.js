// /api/availability
// Récupère le calendrier Google (format iCal) côté serveur, extrait les
// périodes "occupées" (un événement = une réservation) et renvoie une
// liste simple de plages de dates au format JSON.
//
// Un seul agenda Google gère tout : la Villa ET les chambres individuelles.
// Dès qu'une chambre individuelle est réservée (par email), créez aussi un
// événement bloquant dans cet agenda pour ces dates, afin que la Villa
// apparaisse bien indisponible sur le site (règle : chambre réservée ⇒
// Villa indisponible pour ces dates).
//
// L'URL secrète du calendrier ne doit JAMAIS être exposée côté client :
// elle est lue depuis une variable d'environnement Vercel.
//
// Réglage requis sur Vercel : Project → Settings → Environment Variables
//   GOOGLE_CALENDAR_ICS_URL = https://calendar.google.com/calendar/ical/....ics

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');

  const icsUrl = process.env.GOOGLE_CALENDAR_ICS_URL;

  if (!icsUrl) {
    res.status(500).json({
      error: 'GOOGLE_CALENDAR_ICS_URL n\'est pas configurée sur Vercel.',
      ranges: [],
    });
    return;
  }

  try {
    const response = await fetch(icsUrl);
    if (!response.ok) {
      throw new Error('Impossible de récupérer le calendrier (' + response.status + ')');
    }
    const icsText = await response.text();
    const ranges = parseBusyRanges(icsText);
    res.status(200).json({ ranges });
  } catch (err) {
    res.status(200).json({ ranges: [], error: String(err && err.message ? err.message : err) });
  }
};

// ---------- Parsing ICS minimal (sans dépendance externe) ----------

function parseBusyRanges(icsText) {
  const lines = unfoldLines(icsText);
  const ranges = [];
  let inEvent = false;
  let start = null;
  let end = null;

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      start = null;
      end = null;
      continue;
    }
    if (line.startsWith('END:VEVENT')) {
      if (inEvent && start && end) {
        ranges.push({ start, end });
      }
      inEvent = false;
      continue;
    }
    if (!inEvent) continue;

    if (line.startsWith('DTSTART')) {
      start = extractDate(line);
    } else if (line.startsWith('DTEND')) {
      end = extractDate(line);
    }
  }

  return ranges.filter((r) => r.start && r.end);
}

// Les lignes ICS peuvent être repliées sur plusieurs lignes (RFC 5545) :
// une ligne de continuation commence par un espace ou une tabulation.
function unfoldLines(text) {
  const rawLines = text.split(/\r\n|\n|\r/);
  const result = [];
  for (const line of rawLines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && result.length) {
      result[result.length - 1] += line.slice(1);
    } else {
      result.push(line);
    }
  }
  return result;
}

// Extrait une date YYYY-MM-DD depuis une ligne DTSTART/DTEND, que ce soit
// un événement "journée entière" (VALUE=DATE:20260812) ou avec une heure
// (20260812T140000Z) — dans ce cas on ne garde que la partie date.
function extractDate(line) {
  const value = line.split(':').pop().trim();
  const match = value.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  return match[1] + '-' + match[2] + '-' + match[3];
}
