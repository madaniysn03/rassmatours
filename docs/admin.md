# Admin (/admin/)

Espace privé pour le client : lire les messages du formulaire de contact et gérer la galerie de la page Tours.
La page est dans le site (`frontend/src/pages/Admin.tsx`) ; elle parle à l'API de `backend-api/` (`/api/admin/*`).

## Mot de passe

- `ADMIN_PASSWORD` dans `backend-api/.env` (12 caractères ou plus), puis redémarrer le serveur.
- `ADMIN_SESSION_SECRET` : longue chaîne aléatoire (`openssl rand -base64 32`). La changer déconnecte tout le monde.
- Sans `ADMIN_PASSWORD`, le mot de passe de **test** `admin1234` est actif (avertissement dans les logs au démarrage).
  Non sécurisé : à remplacer avant de donner l'accès au client (constante `TEST_PASSWORD` dans `backend-api/src/config.ts`).

## Ce que fait l'admin

- **Messages** : chaque envoi du formulaire (`POST /api/inquiry`) est enregistré dans `backend-api/data/inquiries/`.
  Liste du plus récent au plus ancien, non lus mis en avant, Répondre par e-mail / WhatsApp, lu / non lu, supprimer (définitif).
- **Galerie** : au premier passage, l'admin initialise la galerie du serveur avec celle du site
  (`frontend/src/data/gallery.ts`). Ensuite : ajouter une photo (redimensionnée et convertie en WebP dans le navigateur,
  900 px de haut au plus + une version de 400 px), modifier la description, changer de rangée, réordonner, supprimer.
  Retirer une photo du dépôt ne supprime pas le fichier. La page Tours charge `/api/gallery` (cache 60 s) ; tant que la
  galerie n'est pas initialisée, ou si l'API ne répond pas, elle affiche la galerie du dépôt.
  Les vidéos ne s'ajoutent pas depuis l'admin ; on peut les déplacer ou les retirer.

## Données

```
backend-api/data/
├── inquiries/<id>.json          # un message par fichier
└── gallery/
    ├── manifest.json            # ordre, rangées, descriptions
    └── images/<key>[.json]      # photos envoyées + type MIME
```

À sauvegarder (cron + rsync, ou sauvegarde du VPS). Les messages contiennent des données personnelles : supprimer ceux qui
ne servent plus, et mentionner ce stockage dans la page Privacy.

## Sécurité

- Mot de passe vérifié côté serveur, cookie de session signé (HMAC), `HttpOnly`, `SameSite=Strict`, limité à `/api/`, 12 h ;
  `Secure` dès que le site est en HTTPS (derrière un proxy : `TRUST_PROXY=1`).
- Écritures admin : session + en-tête `X-Admin-Request` (CSRF). `/admin/` est `noindex` et hors sitemap.
- Formulaire : champ piège anti-robots et limite de `INQUIRY_RATE_LIMIT` envois par IP et par 10 minutes.
- Un seul compte. La déconnexion efface le cookie du navigateur ; un cookie copié reste valable jusqu'à son expiration
  (changer `ADMIN_SESSION_SECRET` pour tout invalider).
