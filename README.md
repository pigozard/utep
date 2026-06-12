# UTEP — Outils numériques internes

Outils web pour l'**Unité Transversale d'Éducation du Patient** du Centre Hospitalier Charles Perrens (Bordeaux).

## Structure du projet

```
utep/
├── index.html   # Page d'accueil UTEP
├── style.css    # Styles de index.html
├── bep.html     # Bilan Éducatif Partagé (formulaire)
├── bep.css      # Styles de bep.html
└── bep.js       # Logique du BEP (export JSON/PDF, import)
```

## Pages

### `index.html` — Page d'accueil

Présentation de l'UTEP avec :
- Chiffres clés (programmes, patients, professionnels)
- Grille des 8 programmes d'ETP autorisés
- Schéma du parcours patient en 4 étapes
- Coordonnées de contact
- Accès aux outils numériques

**Palette :** teal `#3e8e9b` · navy `#1c3f73` · orange `#e07d1c`

### `bep.html` — Bilan Éducatif Partagé

Formulaire de diagnostic éducatif à remplir en séance (présentiel ou visio).

Fonctionnalités :
- Saisie libre dans chaque section thématique
- **Enregistrer (.json)** — sauvegarde locale du remplissage
- **Reprendre un fichier** — rechargement d'un .json existant
- **Télécharger le PDF** — impression navigateur optimisée A4

**Aucune donnée n'est envoyée sur Internet.** Tout reste dans le navigateur ; le fichier .json s'enregistre localement.

**Palette :** violet `#5b3a8c` · lavande `#cfd0f5`

## Utilisation

Ouvrir directement `index.html` dans un navigateur — aucun serveur ni dépendance externe requis.

Pour le BEP, le flux recommandé est :
1. Ouvrir `bep.html` avec le patient
2. Remplir les sections en séance
3. **Enregistrer (.json)** pour conserver le brouillon
4. **Télécharger le PDF** pour l'impression ou la transmission

## Évolutions prévues

- Questionnaires d'auto-évaluation
- Supports de séance numérisés

## Contact

**UTEP — CH Charles Perrens**
RDC bâtiment 003 · 137b rue Léo Saignat · 33000 Bordeaux
[utep@ch-perrens.fr](mailto:utep@ch-perrens.fr) · 05.56.56.35.13
Lun–Ven 8h45–16h30
