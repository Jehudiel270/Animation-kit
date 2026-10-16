# Motion Kit — V1 + V2

Une application Next.js unique qui réunit le catalogue V2 et les animations V1. L'accueil propose deux slides, V1 et V2; tu peux passer de l'un à l'autre sans perdre les deux expériences. Le catalogue regroupe les 166 démos V2, les animations V1, 12 sections de landing et une bibliothèque de plus de 1 500 icônes.

Pour mettre le site en ligne, lis **[DEPLOY.md](./DEPLOY.md)**.

## Démarrage rapide

```bash
npm install
npm run dev        # http://localhost:3000
```

## Ce qu'il y a dedans

- **Accueil** : carrousel animé entre les accueils V1 et V2.
- **Catalogue unifié** : filtres et recherche couvrent les deux versions. Les identifiants V1 sont préfixés `v1-` pour rester uniques.
- **Vue détaillée** : ouvre une carte pour la voir en grand, la rejouer et régler ses paramètres. Les démos V1 gardent leur laboratoire d'origine; les démos V2 proposent vitesse (selon le moteur), échelle, luminosité et teinte.
- **26 thèmes** : transition animée lors du changement, avec variantes noir, blanc et niveaux de contraste; le choix est sauvegardé dans le navigateur. La barre de défilement reprend les couleurs du thème.
- **Navigation responsive** : menu compact animé sur mobile et liens complets sur écran large.
- Les anciennes animations V1 sont conservées dans `src/legacy-v1/`; leurs dépendances tsParticles et Lottie ont été adaptées aux versions V2 du projet.
- Les variantes proches restent séparées dans le catalogue lorsqu'elles ont un rendu ou des réglages différents, afin de ne perdre aucun effet des projets d'origine.

| Famille | Nombre | Bibliothèques | Fichiers |
| --- | --- | --- | --- |
| Texte et typographie | 24 | GSAP, SplitText, TextPlugin, ScrambleText | `components/text.tsx`, `registry/text.tsx` |
| Scroll et parallaxe | 22 | GSAP ScrollTrigger, Lenis | `components/scroll.tsx`, `registry/scroll.tsx` |
| 3D et WebGL | 26 | Three.js, React Three Fiber, drei | `components/three.tsx`, `registry/three.tsx` |
| Particules | 18 | tsParticles, nuages de points R3F | `components/particles.tsx`, `registry/particles.tsx` |
| Vidéo et image | 20 | Motion, GSAP, HTML5 video | `registry/media.tsx` |
| Transitions de page | 14 | Motion | `registry/transitions.tsx` |
| Micro-interactions | 20 | Motion, AutoAnimate | `components/micro.tsx`, `registry/micro.tsx` |
| Lottie et Rive | 10 | lottie-react, Rive | `components/lottie.tsx`, `lib/lottie.ts` |
| Sections de landing | 12 | toutes | `components/sections.tsx` |
| Icônes | 1 500+ | lucide-react | `components/icons/` |

Les pages `/catalogue`, `/sections` et `/icons` montrent tout en direct.

## Réutiliser une animation dans un autre projet

1. Dans `/catalogue`, repère l'animation et copie son identifiant (par exemple `text-03`).
2. Ouvre le fichier `src/registry/<famille>.tsx` : la ligne portant ce numéro d'ordre montre quel composant est utilisé et avec quels réglages.
3. Copie le composant (dans `src/components/`) dans ton projet, avec `src/lib/gsap.ts` si GSAP est utilisé.
4. Installe seulement les dépendances nécessaires, par exemple :
   ```bash
   npm install gsap @gsap/react          # texte, scroll
   npm install motion                    # micro-interactions, transitions, médias
   npm install three @react-three/fiber @react-three/drei   # 3D
   npm install @tsparticles/react @tsparticles/slim @tsparticles/engine @tsparticles/plugin-emitters   # particules
   npm install lenis                     # défilement fluide
   npm install lucide-react              # icônes
   ```

Chaque composant a des paramètres simples. Exemple : un effet de texte se règle avec `from`, `stagger`, `ease` ; une forme 3D avec `shape`, `mat`, `motion`.

## Organisation du code

```
src/
  app/              pages Next.js (accueil, catalogue, sections, icônes)
  components/
    text.tsx scroll.tsx three.tsx particles.tsx micro.tsx lottie.tsx sections.tsx
    icons/          Icon, AnimatedIcon, galerie
    core/           Stage (carte de démo), SmoothScroll (Lenis), navigation
    catalogue/      écrans du catalogue et des sections
  registry/         la liste des 166 animations, une famille par fichier
  lib/              gsap.ts (plugins), hooks.ts, media.ts, lottie.ts, utils.ts
public/media/       images SVG et vidéo de démonstration
public/rive/        dépose tes fichiers .riv ici
```

Les démos lourdes (WebGL, vidéo) ne se lancent que lorsqu'elles sont visibles à l'écran (`components/core/Stage.tsx`), pour éviter de saturer le navigateur.

## Passer à Nuxt (ou Vue)

Les bibliothèques de mouvement ne dépendent pas de React. Ce qui change :

| Ici (React) | Équivalent Vue / Nuxt |
| --- | --- |
| GSAP, ScrollTrigger, SplitText | identiques : lance-les dans `onMounted`, nettoie dans `onUnmounted` |
| `@gsap/react` (`useGSAP`) | `gsap.context()` dans `onMounted`, `ctx.revert()` dans `onUnmounted` |
| Lenis | identique (JavaScript pur) |
| Motion (`motion/react`) | `motion-v` |
| React Three Fiber, drei | TresJS (`@tresjs/core`, `@tresjs/cientos`), ou Three.js directement |
| tsParticles React | `@tsparticles/vue3` |
| lottie-react | `lottie-web` ou `vue3-lottie` |
| Rive | `@rive-app/canvas` |
| AutoAnimate (`useAutoAnimate`) | `vAutoAnimate` de `@formkit/auto-animate/vue` |
| lucide-react | `lucide-vue-next` |
| Classes Tailwind | identiques |

Les parties les plus faciles à porter : texte, scroll, particules 2D, 3D en Three.js. Les composants qui utilisent des hooks React (`useTilt`, `useToggle`) deviennent des composables.

## État de vérification

Ce qui a été contrôlé :

- le projet fusionné compile en production (`npm run build`) et le typage TypeScript passe sans erreur ;
- les routes d'accueil, catalogue, sections, icônes et landing sont générées ;
- les identifiants V1 sont préfixés pour ne pas entrer en collision avec les identifiants V2.

Ce qui n'a **pas** pu être contrôlé dans un vrai navigateur : le rendu visuel et le comportement en direct de chaque animation, les scènes WebGL, la lecture vidéo, les options tsParticles et les démos Rive. Ouvre `/catalogue` après l'installation et signale toute démo qui ne se comporte pas comme son titre l'indique : chaque animation vit dans une seule ligne de `src/registry/`, donc un réglage se corrige vite.

## Accessibilité et licences

- Les animations ne s'adaptent pas toutes seules à la préférence « réduire les animations » du système. Pour un projet réel, désactive ou simplifie les effets quand `prefers-reduced-motion: reduce` est actif.
- GSAP (avec ses plugins), Motion, Three.js, tsParticles, Lenis, lottie-react, Rive, AutoAnimate et Lucide sont utilisables dans des projets commerciaux. Lis tout de même la licence de GSAP sur https://gsap.com/standard-license avant un usage commercial.
