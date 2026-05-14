# Job Offer Analysis Agent — Agent d'analyse d'offres d'emploi

## English

### What is this?
An AI-powered agent that compares job offers against your professional profile. Built with the Claude API (Anthropic).

### How it works
1. **Step 0 — Onboarding**: Paste your professional profile (skills, experience, education). The agent creates a structured summary.
2. **Step 4 — Analysis**: Paste any job description. The agent compares it to your profile and generates a structured report.
3. **Result**: Match score (0–100), strengths, gaps, missing keywords, and a recommended positioning angle.

### Workflow overview
```
Step 0 — CV Onboarding (agent reads your profile)
    ↓
Step 1 — Automatic search (agent scrapes job boards)
    ↓
Step 2 — Automatic shortlist (match scoring)
    ↓
Step 3 — Human validation ✋ (you accept or reject each offer)
    ↓
Step 4 — Deep analysis (gaps, strengths, keywords)
    ↓
Step 5 — Action plan (adapted CV, cover letter angle)
    ↓
Output — Structured report per offer
```

### Key design decisions
- **Human-in-the-loop (Step 3)**: The agent never decides alone which jobs to analyze deeply. You validate the shortlist. This avoids wasted effort on irrelevant offers and ensures quality output.
- **Privacy notice**: Users are explicitly told not to share personal data (name, email, phone). Only professional skills and experience are needed.
- **No persistent storage**: The profile is kept in memory during the session only.

### Files
- `agent-fr.html` — French version
- `agent-en.html` — English version
- `workflow-diagram.svg` — System workflow diagram (for presentations)
- `README.md` — This file

### Setup
1. Open `agent-fr.html` or `agent-en.html` in a browser.
2. Add your Anthropic API key to the `callAPI` function (replace the fetch headers with your key).
3. Run locally or deploy to GitHub Pages / Vercel.

### Tech stack
- Vanilla HTML, CSS, JavaScript (no framework)
- Claude API — `claude-sonnet-4-20250514`
- No backend required

---

## Français

### Qu'est-ce que c'est ?
Un agent IA qui compare des offres d'emploi avec votre profil professionnel. Construit avec l'API Claude (Anthropic).

### Comment ça marche
1. **Étape 0 — Onboarding** : Collez votre profil professionnel (compétences, expérience, formation). L'agent crée un résumé structuré.
2. **Étape 4 — Analyse** : Collez une offre d'emploi. L'agent la compare à votre profil et génère un rapport structuré.
3. **Résultat** : Score de match (0–100), points forts, gaps, mots-clés manquants, et un angle de positionnement recommandé.

### Vue d'ensemble du workflow
```
Étape 0 — Onboarding CV (l'agent lit votre profil)
    ↓
Étape 1 — Recherche automatique (scraping des job boards)
    ↓
Étape 2 — Shortlist automatique (scoring de match)
    ↓
Étape 3 — Validation humaine ✋ (vous acceptez ou rejetez chaque offre)
    ↓
Étape 4 — Analyse approfondie (gaps, points forts, mots-clés)
    ↓
Étape 5 — Plan d'action (CV adapté, angle de lettre de motivation)
    ↓
Output — Rapport structuré par poste
```

### Décisions de conception clés
- **Human-in-the-loop (Étape 3)** : L'agent ne décide jamais seul quels postes analyser en profondeur. Vous validez la shortlist. Cela évite le gaspillage d'effort sur des offres non pertinentes.
- **Note de confidentialité** : Les utilisateurs sont explicitement informés de ne pas partager de données personnelles (nom, email, téléphone). Seules les compétences et l'expérience professionnelles sont nécessaires.
- **Pas de stockage persistant** : Le profil est conservé en mémoire pendant la session uniquement.

### Fichiers
- `agent-fr.html` — Version française
- `agent-en.html` — Version anglaise
- `workflow-diagram.svg` — Diagramme du workflow système
- `README.md` — Ce fichier

### Installation
1. Ouvrez `agent-fr.html` ou `agent-en.html` dans un navigateur.
2. Ajoutez votre clé API Anthropic dans la fonction `callAPI`.
3. Lancez en local ou déployez sur GitHub Pages / Vercel.

### Stack technique
- HTML, CSS, JavaScript vanille (sans framework)
- Claude API — `claude-sonnet-4-20250514`
- Pas de backend nécessaire
