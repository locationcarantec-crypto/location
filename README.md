# Vue Mer — Chambres d'hôtes & Villa (Carantec)

Site vitrine statique (HTML / CSS / JS, sans dépendances) déployé sur Vercel, avec calendrier de disponibilités et formulaire de contact connecté par email.

Domaine en ligne : https://www.chambresdhotesvuemer.com

## Structure

```
index.html            Accueil (calendrier de disponibilités intégré)
chambres.html          Notre chambre vue mer
villas.html             Notre villa à la location
disponibilites.html     Calendrier de disponibilités en pleine page
ou-manger.html          Nos adresses restaurants
photos.html              Galerie photo
cgv.html                 Conditions générales de vente
contact.html             Contact + formulaire (envoi par email via /api/contact + Resend)
en/ de/ it/ es/           Versions traduites de chaque page (anglais, allemand, italien, espagnol)
css/style.css            Feuille de style unique
js/main.js               Menu mobile, effet au scroll, lightbox galerie, formulaire, sélecteur de langue
js/calendar.js           Widget de calendrier interactif (disponibilités)
api/availability.js      Fonction serverless Vercel : lit le calendrier Google Agenda (ICS) et renvoie les dates réservées
api/contact.js            Fonction serverless Vercel : envoie l'email de notification + l'email de confirmation client via Resend
favicon.svg               Icône du site
robots.txt / sitemap.xml  SEO
vercel.json               Config de déploiement (URLs propres + cache)
```

## Prévisualiser en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Remarque : `api/availability.js` (la fonction serverless) ne fonctionne pas avec ce serveur local basique. Pour tester le calendrier en conditions réelles, utilisez `vercel dev` ou testez directement sur le déploiement Vercel.

## Déployer sur Vercel

Le site est déjà connecté à Vercel via GitHub (déploiement automatique à chaque `git push` sur la branche `main`). Pour une nouvelle mise en ligne manuelle si besoin :

1. Installer la CLI si besoin : `npm i -g vercel`
2. Depuis ce dossier : `vercel` (première fois) puis `vercel --prod`.

## Calendrier de disponibilités — configuration (à faire une seule fois)

Le calendrier affiche en rouge les dates déjà réservées. La source des dates réservées est un Google Agenda dédié : il suffit d'y créer un événement pour chaque période réservée, sans rien coder.

1. Sur [Google Agenda](https://calendar.google.com), créez un nouvel agenda dédié (ex. "Réservations Vue Mer") ou utilisez-en un existant.
2. Dans les paramètres de cet agenda → **Intégrer l'agenda**, copiez **l'adresse secrète au format iCal** (URL qui se termine par `.ics`).
3. Dans Vercel → votre projet → **Settings → Environment Variables**, ajoutez une variable :
   - Nom : `GOOGLE_CALENDAR_ICS_URL`
   - Valeur : l'URL copiée à l'étape 2
   - Appliquer à : Production (et Preview si besoin)
4. Redéployez le projet (un simple `git push`, ou "Redeploy" dans Vercel) pour que la variable soit prise en compte.
5. Pour bloquer une période : créez un événement "journée entière" sur les dates concernées dans cet agenda Google — il apparaîtra automatiquement en rouge sur le site dans les minutes qui suivent (cache de 5 minutes).

Les visiteurs ne peuvent pas réserver directement : ils sélectionnent une arrivée et un départ sur le calendrier, puis sont dirigés vers le formulaire de contact avec les dates pré-remplies, pour une confirmation manuelle par vos soins.

## Formulaire de contact — envoi des emails (à faire une seule fois)

Le formulaire de contact envoie deux emails via notre propre fonction Vercel `api/contact.js`, qui utilise [Resend](https://resend.com) (gratuit jusqu'à 3000 emails/mois) :

1. Une notification à **location.carantec@gmail.com**, avec les détails de la demande, mise en forme et personnalisée — avec "Répondre à" réglé sur l'adresse du client, pour pouvoir répondre directement.
2. Un email de confirmation automatique envoyé au client, dans la langue de la page qu'il a utilisée (français, anglais, allemand, italien ou espagnol), lui confirmant que sa demande a bien été reçue et que vous le recontacterez rapidement.

Cela remplace Formspree, dont le plan gratuit ne permet ni de personnaliser l'email reçu, ni d'envoyer une confirmation automatique au client (ces deux fonctionnalités nécessitent un abonnement payant chez Formspree).

### Configuration (à faire une seule fois)

1. Créez un compte gratuit sur https://resend.com.
2. Dans Resend, allez dans **Domains → Add Domain** et ajoutez `chambresdhotesvuemer.com`.
3. Resend affiche 2 à 3 enregistrements DNS à ajouter (TXT/CNAME, pour vérifier que vous êtes bien propriétaire du domaine et autoriser l'envoi d'emails). Ajoutez-les à l'endroit où vous gérez les DNS de votre domaine (chez votre registrar, ou dans l'onglet **Domains** de Vercel si les DNS y sont gérés). La vérification prend généralement de quelques minutes à 1 heure.
4. Une fois le domaine marqué "Verified" dans Resend, allez dans **API Keys → Create API Key** (droits "Sending access" suffisent), et copiez la clé (elle commence par `re_`).
5. Dans Vercel → votre projet → **Settings → Environment Variables**, ajoutez une variable :
   - Nom : `RESEND_API_KEY`
   - Valeur : la clé copiée à l'étape 4
   - Appliquer à : Production (et Preview si besoin)
6. Redéployez le projet (un simple `git push`, ou "Redeploy" dans Vercel) pour que la variable soit prise en compte.
7. Faites un envoi de test depuis le site pour confirmer que vous recevez bien l'email sur `location.carantec@gmail.com`, et que l'adresse utilisée pour le test reçoit bien l'email de confirmation.

L'adresse d'expédition utilisée est `reservation@chambresdhotesvuemer.com` (modifiable dans `api/contact.js`, constante `FROM_EMAIL`, tout en haut du fichier) — elle doit appartenir au domaine vérifié dans Resend à l'étape 3.

**Important :** tant que le domaine n'est pas vérifié dans Resend, les emails de test ne peuvent être envoyés qu'à l'adresse ayant créé le compte Resend (mode "bac à sable") — pas encore aux clients. Une fois le domaine vérifié, ça fonctionne pour n'importe quelle adresse.

## À propos des photos

Les photos utilisées proviennent actuellement directement de l'ancien hébergement Wix (static.wixstatic.com). C'est fonctionnel, mais idéalement il faudrait à terme télécharger les photos originales (en meilleure qualité) et les héberger dans un dossier `images/` du projet.

## Reste à faire avec JM

- Configurer le calendrier Google Agenda et la variable `GOOGLE_CALENDAR_ICS_URL` sur Vercel (voir section ci-dessus).
- Créer le compte Resend, vérifier le domaine et ajouter `RESEND_API_KEY` sur Vercel (voir section ci-dessus).
- Relire les textes (chambre, villa, CGV) et valider les tarifs actuels.
- Décider si on héberge les photos nous-mêmes ou si on garde le lien Wix.
