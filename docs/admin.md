# Admin (/admin/)

Espace privé pour le client : lire les messages du formulaire de contact et gérer la galerie de la page Tours.
Il repose sur des **Netlify Functions** (`netlify/functions/`) et **Netlify Blobs** (stockage clé-valeur fourni
par Netlify, sans base de données à gérer). Il ne fonctionne donc que sur Netlify, ou en local avec `netlify dev`.

## Mot de passe de test

Tant que `ADMIN_PASSWORD` n'est pas défini sur Netlify, le mot de passe est **`admin1234`** (constante `TEST_PASSWORD`
dans `netlify/lib/server.ts`). Ce n'est pas sécurisé (le mot de passe est dans le dépôt) : à remplacer avant de
donner l'accès au client, en définissant `ADMIN_PASSWORD` (prioritaire) ou en vidant `TEST_PASSWORD`.

## Mise en ligne (une fois)

1. Netlify > Site configuration > Environment variables, ajouter :
   - `ADMIN_PASSWORD` : mot de passe de l'admin (12 caractères ou plus ; 8 au minimum, sinon l'admin reste désactivé).
   - `ADMIN_SESSION_SECRET` : longue chaîne aléatoire (ex. `openssl rand -base64 32`). La changer déconnecte tout le monde.
   Scope : « Functions » suffit. Ne pas les préfixer par `VITE_` (elles seraient publiées dans le JavaScript du site).
2. Redéployer. Netlify Blobs s'active tout seul, rien d'autre à configurer.
3. Ouvrir `https://<domaine>/admin/` et se connecter.

## Ce que fait l'admin

- **Messages** : chaque envoi du formulaire de contact (`POST /api/inquiry`) est enregistré. Liste du plus récent au plus
  ancien, non lus mis en avant, boutons Répondre par e-mail / WhatsApp, marquer lu / non lu, supprimer (définitif).
- **Galerie** : ajouter une photo (redimensionnée et convertie en WebP dans le navigateur avant l'envoi, 900 px de haut
  au plus, plus une version de 400 px), modifier la description (texte alt), changer de rangée, réordonner, supprimer.
  Les photos du dépôt (`public/images/gallery/`) apparaissent aussi : les retirer de la galerie ne supprime pas le fichier.
  La page Tours charge la galerie depuis `/api/gallery` (cache 60 s) ; le HTML prérendu contient la galerie du dépôt.
  Les vidéos ne s'ajoutent pas depuis l'admin (poids trop élevé pour une Function) ; on peut les retirer ou les déplacer.

## Sécurité

- Mot de passe vérifié côté serveur, cookie de session signé (HMAC), `HttpOnly`, `SameSite=Strict`, limité à `/api/`, 12 h.
- Écritures admin : session + en-tête `X-Admin-Request` (protection CSRF). `/admin/` est `noindex` et hors sitemap.
- Pas de limitation de débit sur `/api/inquiry` (champ piège anti-robots seulement) : si du spam arrive, ajouter
  une règle de rate limiting Netlify sur ce chemin.
- Un seul compte. Pour plusieurs utilisateurs avec mots de passe distincts, passer à un fournisseur d'identité.

## En local

```bash
npx netlify-cli dev --offline   # Node 22 requis ; site sur http://localhost:8888, admin sur /admin/
```

`netlify dev` lit `ADMIN_PASSWORD` et `ADMIN_SESSION_SECRET` dans `.env` (non versionné) et stocke les Blobs dans `.netlify/`.
Avec `npm run dev` seul (Vite, port 5173), l'API n'existe pas : la galerie du dépôt s'affiche et le formulaire tombe sur
son message d'erreur avec les liens WhatsApp / e-mail.

## Données personnelles

Les messages contiennent des données personnelles (nom, e-mail, téléphone) stockées chez Netlify. Supprimer ceux qui
ne servent plus, et mettre à jour la page Privacy pour mentionner ce stockage.
