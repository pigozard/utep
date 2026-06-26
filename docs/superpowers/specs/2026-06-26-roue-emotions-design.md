# Roue des émotions — Design Spec
Date: 2026-06-26

## Contexte
Outil thérapeutique utilisé par des soignants de l'UTEP (CH Charles Perrens, Bordeaux) en présentiel ou en visioconférence. Reproduction numérique de la roue physique à 3 disques concentriques rotatifs.

## Fichiers créés
- `roue-des-emotions.html` — page standalone (même structure que bep.html)
- `roue-des-emotions.css` — styles spécifiques
- `roue-des-emotions.js` — logique SVG + interactions
- Activation de la carte dans `index.html` (retrait classe `disabled`)

## Structure de la page
Barre de navigation haut : `← Accueil` + bouton `Réinitialiser`.
Titre centré + sous-titre explicatif.
SVG 600×600 (responsive via viewBox).
Panneau de contrôles sous la roue : 3 lignes (une par anneau) avec label + boutons ← →.

## Architecture SVG

### Coordonnées
- Centre : (300, 300)
- SVG viewBox : `0 0 600 600`

### 3 anneaux (groupes `<g>` indépendants)
| Anneau | r intérieur | r extérieur | Segments | Angle/segment |
|--------|-------------|-------------|----------|---------------|
| Émotions primaires | 0 | 110 | 6 | 60° |
| Nuances | 110 | 220 | 28 | ~12.857° |
| Besoins | 220 | 300 | 6 | 60° |

Chaque `<g>` porte `transform="rotate(angle 300 300)"` mis à jour dynamiquement.

### Données — Émotions primaires (6 × 60°)
```js
[
  { label: "JOIE",      couleur: "#E040A0" },
  { label: "PEUR",      couleur: "#29B6D4" },
  { label: "DÉGOÛT",    couleur: "#66BB6A" },
  { label: "SURPRISE",  couleur: "#9CCC65" },
  { label: "TRISTESSE", couleur: "#FFC107" },
  { label: "COLÈRE",    couleur: "#EF5350" },
]
```

### Données — Nuances (28 × 12.857°)
```js
[
  "TERRIFIÉ","PRÉOCCUPÉ","MÉFIANT","ANGOISSÉ",
  "SATISFAIT","OPTIMISTE","HEUREUX","EXCITÉ","AMOUREUX",
  "IRRITÉ","IMPATIENT","FURIEUX","EXASPÉRÉ",
  "DÉSESPÉRÉ","DÉSOLÉ","DÉÇU","AFFECTÉ","ABATTU",
  "TROUBLÉ","SECOUÉ","EMERVEILLÉ","ÉTONNÉ",
  "ENTHOUSIASTE","MÉPRISÉ","CONTRARIÉ","BLESSÉ","AMER","AIGRI"
]
```
Couleurs interpolées depuis les couleurs primaires (chaque nuance hérite de la teinte de l'émotion primaire correspondante).

### Données — Besoins (6 × 60°)
```js
[
  { label: "SE SENTIR EN SÉCURITÉ\nÊTRE RASSURÉ",                    couleur: "#29B6D4" },
  { label: "SE PROTÉGER DE CE QUI\nEST DANGEREUX POUR SOI",          couleur: "#66BB6A" },
  { label: "FAIRE FACE À L'IMPRÉVU\nPOUVOIR AGIR EN CONSÉQUENCE",   couleur: "#A5B041" },
  { label: "ÊTRE ÉCOUTÉ, CONSOLÉ\nÊTRE RÉCONFORTÉ",                  couleur: "#8D7B3A" },
  { label: "ÊTRE RESPECTÉ\nÊTRE ÉCOUTÉ ET COMPRIS",                  couleur: "#8B2020" },
  { label: "ÊTRE EN LIEN\nPARTAGER AVEC LES AUTRES",                 couleur: "#7B3F9E" },
]
```

### Texte sur arc
- Utilisation de `<textPath>` avec `xlink:href` pointant vers un `<path>` circulaire invisible
- Rayon du chemin de texte = milieu de l'anneau
- `startOffset="50%"` + `text-anchor="middle"` pour centrer dans le segment
- Taille de police : 10px (primaires), 8px (nuances), 8px (besoins, multi-ligne)

## Dessin SVG d'un segment d'anneau
Chaque segment est un `<path>` calculé avec :
```
M (cos(startAngle) * rOuter + cx, sin(startAngle) * rOuter + cy)
A rOuter rOuter 0 largeArc 1 (cos(endAngle) * rOuter + cx, sin(endAngle) * rOuter + cy)
L (cos(endAngle) * rInner + cx, sin(endAngle) * rInner + cy)
A rInner rInner 0 largeArc 0 (cos(startAngle) * rInner + cx, sin(startAngle) * rInner + cy)
Z
```
Séparateurs entre segments : lignes radiales fines (`stroke: rgba(0,0,0,0.15)`).

## Interactions

### Drag (glisser-tourner)
- `pointerdown` sur le SVG : calcule l'angle initial entre centre et pointeur
- Détecte l'anneau selon la distance au centre (< 110 → primaires, 110-220 → nuances, 220-300 → besoins)
- `pointermove` : calcule le nouvel angle, applique le delta à la rotation du groupe ciblé
- `pointerup` : libère

### Boutons ← →
- ← : `angle -= segmentAngle` (un cran)
- → : `angle += segmentAngle` (un cran)
- Animation : `transition: transform 0.3s cubic-bezier(.34,1.56,.64,1)` sur le `<g>`

### Réinitialiser
- Remet les 3 angles à 0° avec transition

## Style visuel
- Fond et typographie identiques au reste du site (variable CSS de `style.css` réutilisées)
- Barre de navigation : même style que bep.html
- Boutons ← → : style glassmorphism cohérent avec les boutons existants
- Pas de sauvegarde de session (l'outil est utilisé en direct)

## Responsive
- SVG avec `viewBox="0 0 600 600"` + `width: 100%` + `max-width: 560px`
- Contrôles en colonne sur mobile
- Touch events supportés via Pointer Events API
