# BaoPixel Studio OS — Déploiement Vercel

## 🚀 Déployer en 5 minutes

### Méthode 1 — GitHub + Vercel (recommandée, mises à jour automatiques)

1. **Créer un repo GitHub**
   ```
   git init
   git add .
   git commit -m "feat: BaoPixel Studio OS v1.0"
   git remote add origin https://github.com/VOTRE_USERNAME/baopixel-studio.git
   git push -u origin main
   ```

2. **Importer sur Vercel**
   - Aller sur https://vercel.com/new
   - Cliquer "Import Git Repository"
   - Sélectionner votre repo `baopixel-studio`
   - Framework: **Next.js** (auto-détecté)
   - Cliquer **Deploy**

3. **Ajouter la variable d'environnement IA**
   - Dans Vercel → Settings → Environment Variables
   - Ajouter : `ANTHROPIC_API_KEY` = votre clé API Claude
   - Redéployer

---

### Méthode 2 — Vercel CLI (direct)

```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

---

## 🔑 Variables d'environnement requises

| Variable | Description | Où l'obtenir |
|---|---|---|
| `ANTHROPIC_API_KEY` | Clé API Claude pour Veille IA, Guide Algo, Reporting IA, Decks | https://console.anthropic.com |

---

## 🔄 Mises à jour automatiques

Une fois connecté GitHub → Vercel :
- Chaque `git push` sur `main` redéploie automatiquement
- Les données (localStorage) restent côté client
- L'app est disponible 24h/24 depuis n'importe quel appareil

---

## 📱 Accès multi-appareil

L'URL Vercel (ex: `baopixel-studio.vercel.app`) est accessible sur :
- Ordinateur de bureau
- MacBook / laptop
- Téléphone mobile (Progressive Web App)

---

## 🔐 Sécurité

- Authentification par PIN à 4 chiffres
- Données stockées en localStorage (client uniquement)
- API key stockée côté serveur Vercel (jamais exposée côté client)
- Verrouillage automatique avec `Ctrl+L`

---

## 📦 Stack technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Hosting** : Vercel (serverless)
- **DB** : localStorage (client) — évolutif vers Vercel KV
- **IA** : Claude claude-sonnet-4-20250514 via API Anthropic
- **CSS** : CSS Variables (zéro dépendance UI)

---

*BaoPixel Digital Agency — Mbour, Petite-Côte, Sénégal*
