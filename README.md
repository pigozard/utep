# UTEP — Outils et ressources

Outils web internes de l'**Unité Transversale d'Éducation du Patient**  
Centre Hospitalier Charles Perrens — Bordeaux

---

## Structure

```
utep/
├── index.html        # Page d'accueil — grille des outils
├── style.css         # Styles de index.html
├── bep.html          # Bilan Éducatif Partagé
├── bep.css           # Styles de bep.html
└── bep.js            # Logique du BEP
```

## Outils

| Outil | Fichier | État |
|---|---|---|
| Bilan éducatif partagé | `bep.html` | ✅ Disponible |
| Roue des émotions | `roue-des-emotions.html` | 🔜 À venir |
| Cartes BDL | `cartes-bdl.html` | 🔜 À venir |
| Mes facteurs déclencheurs | `facteurs-declencheurs.html` | 🔜 À venir |
| Comprendre l'ECT | `comprendre-ect.html` | 🔜 À venir |
| Questionnaire de satisfaction | `questionnaire-satisfaction.html` | 🔜 À venir |
| Formulaire de recueil | `formulaire-recueil.html` | 🔜 À venir |

## Bilan Éducatif Partagé (`bep.html`)

Formulaire de diagnostic éducatif rempli en séance (présentiel ou visio).

**Sections :** Mon histoire · Moi · Mes ressources · Mon quotidien · Suivi et soin · Répercussions de la maladie · Mes priorités · Mes objectifs · Participation ETP

**Actions disponibles dans la barre :**
- **↺ Effacer** — remet le formulaire à zéro (avec confirmation)
- **Télécharger le PDF** — impression navigateur optimisée A4

> Aucune donnée n'est envoyée sur Internet. Tout reste dans le navigateur.

## Ajouter un nouvel outil

1. Créer le fichier HTML (ex. `roue-des-emotions.html`)
2. Retirer la classe `disabled` de la carte correspondante dans `index.html`

## Utilisation

Ouvrir `index.html` directement dans un navigateur — aucun serveur ni dépendance externe requis.
