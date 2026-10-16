# Déployer Motion Kit

Ce guide va du zip à un site en ligne. Choisis **une** option (A, B, C ou D) dans la partie 3.

## 1. Prérequis

- Node.js **20.9 ou plus récent** (la version 22 LTS est recommandée). Vérifie avec `node -v`.
- npm (installé avec Node.js).
- Pour les options A et B : un compte GitHub et un compte Vercel ou Netlify (gratuits pour commencer).

Le projet n'a besoin d'aucune variable d'environnement ni de base de données.

## 2. Lancer en local

```bash
unzip motion-kit.zip
cd motion-kit
npm install
npm run dev
```

Ouvre http://localhost:3000. Pages disponibles :

| Adresse | Contenu |
| --- | --- |
| `/` | Accueil : hero 3D, chiffres, pied de page interactif |
| `/catalogue` | Les 166 animations en direct, avec recherche et filtres |
| `/sections` | Les 12 sections de landing, avec défilement fluide |
| `/icons` | Bibliothèque d'icônes : recherche, taille, trait, couleur, copie du code |

Avant de déployer, vérifie que tout compile :

```bash
npm run typecheck
npm run build
npm start        # teste la version de production sur http://localhost:3000
```

## 3. Choisir où déployer

### Option A : Vercel (le plus simple)

Avec GitHub :

1. Crée un dépôt GitHub et envoie le projet :
   ```bash
   git init
   git add .
   git commit -m "Motion Kit"
   git branch -M main
   git remote add origin https://github.com/TON-COMPTE/motion-kit.git
   git push -u origin main
   ```
2. Sur https://vercel.com/new, importe le dépôt. Vercel détecte Next.js tout seul.
3. Laisse les réglages par défaut (build : `npm run build`) et clique sur **Deploy**.

Chaque `git push` redéploie ensuite le site automatiquement.

Sans GitHub, avec la ligne de commande :

```bash
npm install -g vercel
vercel          # première fois : répond aux questions, crée un déploiement de test
vercel --prod   # publie en production
```

### Option B : Netlify

1. Envoie le projet sur GitHub (étape 1 de l'option A).
2. Sur https://app.netlify.com, clique sur **Add new site > Import an existing project** et choisis le dépôt.
3. Netlify reconnaît Next.js. Garde la commande de build `npm run build` et clique sur **Deploy**.

### Option C : site statique (n'importe quel hébergeur)

Le site n'a pas de code serveur : tu peux le publier comme de simples fichiers. C'est l'option la plus économique (hébergement mutualisé, cPanel, Cloudflare Pages, Netlify, GitHub Pages).

```bash
npm run build:static
```

Le site complet est généré dans le dossier **`out/`**.

- **Hébergement classique (cPanel, FTP)** : envoie le *contenu* du dossier `out/` à la racine de ton site (`public_html`).
- **Cloudflare Pages** : commande de build `npm run build:static`, dossier de sortie `out`.
- **Netlify (glisser-déposer)** : glisse le dossier `out/` sur https://app.netlify.com/drop.
- **GitHub Pages** : si le site est servi dans un sous-dossier (`https://compte.github.io/motion-kit/`), ajoute `basePath: "/motion-kit"` dans `next.config.ts` avant de construire.

### Option D : serveur à toi (VPS) ou Docker

Avec Docker :

```bash
docker build -t motion-kit .
docker run -d -p 3000:3000 --restart unless-stopped motion-kit
```

Sans Docker, sur un serveur avec Node.js :

```bash
npm ci
npm run build:standalone
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
PORT=3000 node .next/standalone/server.js
```

Place ensuite un proxy (Caddy ou Nginx) devant le port 3000 pour le nom de domaine et le HTTPS. Garde le processus actif avec `pm2` ou `systemd`.

## 4. Personnaliser avant de publier

| Quoi | Où |
| --- | --- |
| Couleurs du thème | variables `--color-*` dans `src/app/globals.css` |
| Titre et description du site | `metadata` dans `src/app/layout.tsx` |
| Images de démonstration | `public/media/img-1.svg` à `img-6.svg` (garde les mêmes noms, ou change `src/lib/media.ts`) |
| Vidéo de démonstration | `public/media/loop.mp4` (une vidéo courte, en boucle, de préférence sous 5 Mo) |
| Animations Rive | dépose tes fichiers `.riv` dans `public/rive/` |
| Nom de domaine | réglage du domaine chez Vercel, Netlify ou ton hébergeur |

## 5. Problèmes fréquents

- **`npm install` échoue avec une erreur de version** : vérifie `node -v` (20.9 minimum).
- **Le build manque de mémoire** : sur un petit serveur, ajoute du swap ou construis en local puis envoie `out/` (option C).
- **Les scènes 3D restent noires** : l'accélération matérielle du navigateur est désactivée, ou la carte graphique est trop ancienne.
- **La vidéo ne se lance pas** : le navigateur bloque la lecture automatique des vidéos avec son. Les démos sont en `muted` : garde cet attribut.
- **Les deux démos Rive restent vides** : la première charge un exemple depuis `cdn.rive.app` (connexion Internet nécessaire), la seconde attend ton fichier `public/rive/mon-animation.riv`.
- **Rive en production** : par défaut, la bibliothèque télécharge son moteur (fichier WASM) depuis un CDN public. Pour l'héberger toi-même, consulte la documentation de Rive (`RuntimeLoader.setWasmUrl`).
