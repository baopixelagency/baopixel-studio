# 📋 Guide de Déploiement - BaoPixel Studio OS

## ✅ État actuel
- [x] Dépôt Git initialisé localement
- [x] Code commité (`feat: BaoPixel Studio OS v1.0`)
- [x] Branche `main` configurée
- [x] `.gitignore` créé
- [x] GitHub Actions CI/CD activé
- [ ] Dépôt GitHub créé
- [ ] Code pushé vers GitHub
- [ ] Vercel configuré
- [ ] Déploiement en production

---

## 🔧 Étape 1: Créer le dépôt sur GitHub

### Via l'interface GitHub (https://github.com/new)

1. **Connexion**
   - Allez sur https://github.com/baopixel (votre compte)
   - Cliquez sur "New" (ou ➕)

2. **Détails du dépôt**
   - Repository name: `baopixel-studio`
   - Description: `BaoPixel Studio OS — Outil de gestion d'agence multitâche`
   - Visibility: **Public** (recommandé pour le portfolio) ou **Private**
   - **Décochez** "Initialize this repository with a README"
   - Cliquez **"Create repository"**

3. **URL créée**
   ```
   https://github.com/baopixel/baopixel-studio.git
   ```

---

## 🚀 Étape 2: Pousser le code vers GitHub

Une fois le dépôt créé, exécutez dans le terminal:

```bash
cd "c:\Users\tanor fall\Downloads\files\baopixel-studio-deploy\baopixel-studio"

# Configurer l'URL distante
git remote add origin https://github.com/baopixel/baopixel-studio.git

# Pousser la branche main
git push -u origin main
```

**Résultat attendu:**
```
Enumerating objects: 13, done.
...
To https://github.com/baopixel/baopixel-studio.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🔗 Étape 3: Configurer Vercel (Déploiement automatique)

### 3.1 Se connecter à Vercel

1. Allez sur https://vercel.com
2. Connectez-vous avec votre compte GitHub (ou créez un compte)

### 3.2 Importer le projet depuis GitHub

1. **Dashboard Vercel** → "Add New..." → "Project"
2. **Cliquez "Import Git Repository"**
3. **Autorisez Vercel** à accéder à votre compte GitHub
4. **Recherchez et sélectionnez** `baopixel-studio`
5. **Paramètres d'importation:**
   - Framework: **Next.js** ✓ (auto-détecté)
   - Root Directory: `./` ✓
   - Build Command: `npm run build` ✓
   - Output Directory: `.next` ✓
   - **Aucune variable d'environnement pour maintenant** (voir étape 3.3)
6. **Cliquez "Deploy"** → Vercel commencera à construire (~2-3 min)

### 3.3 Ajouter les variables d'environnement (Important!)

Une fois le déploiement initial réussi:

1. **Vercel Dashboard** → Sélectionnez `baopixel-studio`
2. **Settings** → **Environment Variables**
3. **Ajouter une variable:**
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (votre clé API de https://console.anthropic.com)
   - Environments: Cochez **Production**, **Preview**, **Development**
4. **Cliquez "Add"**
5. **Redéployer** (Settings → Deployments → Redeploy... ou attendez le prochain push)

---

## 🔐 Étape 4: Configurer GitHub Secrets (pour CI/CD automatique)

### 4.1 Générer un token Vercel

1. Allez sur https://vercel.com/account/tokens
2. **Create Token:**
   - Scope: **Full Account**
   - Expira: **90 days** (ou custom)
3. **Copiez le token** (cachez-le bien!)

### 4.2 Ajouter le secret GitHub

1. **GitHub** → Votre dépôt → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret:**
   - Name: `VERCEL_TOKEN`
   - Value: Collez votre token Vercel
3. **Cliquez "Add secret"**

### 4.3 (Optionnel) Ajouter VERCEL_ORG_ID et VERCEL_PROJECT_ID

1. **Vercel CLI** (opcional, automatique sinon):
   ```bash
   npm install -g vercel
   vercel link
   ```
   Cela crée `.vercel/project.json`

2. Ou manuellement:
   - `VERCEL_ORG_ID`: Trouvé dans Vercel Settings → Team ID
   - `VERCEL_PROJECT_ID`: Trouvé dans `.vercel/project.json` après un `vercel link`

---

## 🔄 Utilisation quotidienne

### Pousser des mises à jour

```bash
git add .
git commit -m "feat: Description courte de la modification"
git push origin main
```

**Automatiquement:**
1. ✅ GitHub Actions démarre le workflow (`deploy.yml`)
2. ✅ Build vérifié (`npm run build`)
3. ✅ Code pushé vers Vercel
4. ✅ Vercel redéploie en production (~1-2 min)
5. ✅ App disponible sur `https://baopixel-studio.vercel.app`

### Vérifier le statut

- **GitHub:** Repo → **Actions** → Voir les workflows
- **Vercel:** Dashboard → **Deployments** → Voir les builds
- **Production:** https://baopixel-studio.vercel.app

---

## 🛠️ Bonnes pratiques

### Conventions de commits
```
feat: Nouvelle fonctionnalité
fix: Correction de bug
docs: Mise à jour de documentation
style: Formatting
refactor: Refacto du code
perf: Amélioration de performance
test: Ajout de tests
chore: Mise à jour de dépendances
```

### Exemple
```bash
git commit -m "feat: Ajouter export PDF pour les rapports"
git commit -m "fix: Corriger le bug de connexion PIN"
git commit -m "docs: Mettre à jour le guide de déploiement"
```

### Branches (optionnel, pour équipes)
```bash
# Créer une branche pour une feature
git checkout -b feat/nouvelle-feature

# Travailler sur la branche
git add .
git commit -m "feat: Implémenter nouvelle-feature"

# Créer une Pull Request sur GitHub
# Une fois approuvée, merger vers main
git checkout main
git merge feat/nouvelle-feature
git push origin main
```

---

## 🔗 URLs importantes

| Service | URL |
|---------|-----|
| Dépôt GitHub | https://github.com/baopixel/baopixel-studio |
| Dashboard Vercel | https://vercel.com/baopixel/baopixel-studio |
| Production en direct | https://baopixel-studio.vercel.app |
| Secrets GitHub | https://github.com/baopixel/baopixel-studio/settings/secrets/actions |
| API Anthropic | https://console.anthropic.com |

---

## ⚠️ Dépannage

### Le déploiement Vercel échoue
1. Vérifiez les logs: **Vercel Dashboard → Deployments → Cliquez sur le déploiement**
2. Vérifiez les variables d'environnement: **Settings → Environment Variables**
3. Les dépendances npm sont-elles correctes? `npm install`

### GitHub Actions échoue
1. **GitHub → Repo → Actions** → Voir le détail de l'erreur
2. Vérifiez `VERCEL_TOKEN` dans **Settings → Secrets**
3. Le token a-t-il expiré? Générez un nouveau depuis Vercel

### "fatal: remote already exists"
```bash
git remote remove origin
git remote add origin https://github.com/baopixel/baopixel-studio.git
git push -u origin main
```

---

## 📞 Support

Pour toute question:
- Docs Vercel: https://vercel.com/docs
- Docs Next.js: https://nextjs.org/docs
- GitHub: https://docs.github.com

---

**BaoPixel Digital Agency** — Mbour, Sénégal
*Déployé avec ❤️ en production*
