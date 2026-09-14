# Amy Studio — TikTok Content Planner

Planificateur de contenu TikTok (dashboard, calendrier, vue semaine, pipeline drag & drop, bloc Canada, export iCal).
100 % statique, aucune base de données : tout est sauvegardé dans le `localStorage` du navigateur.

## Mise en ligne sur GitHub Pages

1. Crée un repo (ex. `amy-studio`) et pousse le contenu de ce dossier :
   ```bash
   git init
   git add .
   git commit -m "Amy Studio"
   git branch -M main
   git remote add origin https://github.com/<ton-user>/amy-studio.git
   git push -u origin main
   ```
2. Sur GitHub : **Settings → Pages → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
3. Le site est en ligne sous une minute sur `https://<ton-user>.github.io/amy-studio/`.

Rien d'autre à installer : `index.html` est autonome (styles, scripts et photo intégrés).

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | **L'app déployable.** Fichier unique autonome, fonctionne aussi en double-clic hors ligne. |
| `Amy Content Studio.dc.html` | La source éditable de l'app. |
| `amy-hero.png` | Photo du bloc d'accueil. |
| `support.js` | Runtime utilisé par le fichier source. |
| `.nojekyll` | Empêche GitHub de filtrer des fichiers au déploiement. |

## Fonctionnalités

- **Dashboard** — bloc d'accueil avec photo, 4 stats live, prochaines actions cliquables.
- **Calendrier** — mois navigable, badges des semaines Canada, clic sur un jour pour planifier.
- **Semaine** — vue 7 jours détaillée, navigation semaine précédente / suivante / aujourd'hui.
- **Pipeline** — 4 colonnes (À filmer, À monter, À poster, Postés), glisser-déposer entre colonnes, clic pour éditer, suppression.
- **Canada** — blocs Semaine 1 / Semaines 2-3 / Hors voyage avec les contenus assignés par dates.
- **Export iCal** — bouton dans le calendrier, génère un `.ics` importable dans Google / Apple Calendar.

## Modifier le contenu

Les 8 contenus de démarrage sont dans la constante `SEED` du fichier source, les dates du voyage dans `TRIP`.
Après modification de la source, régénère `index.html` (fichier autonome) avant de pousser.

## Réinitialiser les données

Dans la console du navigateur :
```js
localStorage.removeItem('amy-studio-posts-v2')
```
