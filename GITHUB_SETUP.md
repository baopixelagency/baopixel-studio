# 🔐 Configuration GitHub avec Personal Access Token (PAT)

## 📋 Votre configuration
- **Nom d'utilisateur:** baopixelagency
- **Méthode auth:** Personal Access Token (HTTPS)
- **URL dépôt:** https://github.com/baopixelagency/baopixel-studio.git

---

## ✅ Étape 1: Créer un Personal Access Token sur GitHub

### 1.1 Générer le token

1. **Allez sur:** https://github.com/settings/tokens
2. **Cliquez:** "Generate new token" → "Generate new token (classic)"
3. **Remplissez:**
   - **Note:** `baopixel-studio-deployment`
   - **Expiration:** `90 days` (valeur recommandée) ou `No expiration`
   - **Scopes (permissions):** ☑️ Cochez les cases:
     - [x] **repo** (contrôle complet des dépôts)
     - [x] **admin:repo_hook** (gestion des webhooks)
     - [x] **workflow** (gestion des GitHub Actions)

4. **Cliquez:** "Generate token"
5. **Copiez immédiatement** le token (vous ne pourrez pas le revoir!)
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx...
   ```

**⚠️ IMPORTANT:** Gardez ce token secret! Ne le partagez jamais.

---

## 🔑 Étape 2: Configurer Git en local

### Créez un fichier `.git-credentials` (Windows)

Le plus simple est de laisser Git gérer vos identifiants. Voici comment:

**Option A:** Utiliser le gestionnaire de credentials Windows (Recommandé)

```powershell
# PowerShell en tant qu'administrateur

# Configurer git pour utiliser le gestionnaire Windows
git config --global credential.helper wincred

# Ou si vous préférez manager core:
git config --global credential.helper manager-core
```

Puis quand vous ferez `git push`, Windows vous demandera vos identifiants une seule fois, et les mémorisera.

**Option B:** Créer un Personal Access Token dans l'URL HTTPS (moins sécurisé)

```powershell
# Ne pas recommandé, mais possible:
git remote set-url origin https://baopixelagency:YOUR_TOKEN@github.com/baopixelagency/baopixel-studio.git
```

---

## 🚀 Étape 3: Créer le dépôt sur GitHub

1. **Allez sur:** https://github.com/new
2. **Remplissez:**
   - **Repository name:** `baopixel-studio`
   - **Description:** `BaoPixel Studio OS — Outil de gestion d'agence`
   - **Visibility:** Public (portfolio) ou Private (sécurité)
   - **❌ Décochez** "Initialize this repository"
3. **Cliquez:** "Create repository"
4. **GitHub affichera les instructions:** Ignorez-les, suivez plutôt ci-dessous

---

## 📤 Étape 4: Pousser le code vers GitHub

### Via Command Prompt / PowerShell

```powershell
cd "c:\Users\tanor fall\Downloads\files\baopixel-studio-deploy\baopixel-studio"

# Configurer l'URL distante
git remote add origin https://github.com/baopixelagency/baopixel-studio.git

# Pousser le code
git push -u origin main
```

### Ou exécuter le script helper

**Windows (Command Prompt):**
```cmd
cd c:\Users\tanor fall\Downloads\files\baopixel-studio-deploy\baopixel-studio
deploy.bat baopixelagency
```

**macOS/Linux:**
```bash
cd /path/to/baopixel-studio
chmod +x deploy.sh
./deploy.sh baopixelagency
```

---

## ✓ Vérifier le succès

Après `git push`, vous devriez voir:

```
Enumerating objects: 15, done.
Counting objects: 100% (15/15), done.
Delta compression using up to 8 threads
Compressing objects: 100% (10/10), done.
Writing objects: 100% (15/15), 15.23 KiB | 2.54 MiB/s, done.
Total 15 (delta 0), reused 0 (delta 0)

To https://github.com/baopixelagency/baopixel-studio.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**Vérification:**
- Allez sur https://github.com/baopixelagency/baopixel-studio
- Vous devriez voir tous les fichiers du projet

---

## 🔗 Étape 5: Configurer Vercel (déploiement production)

### 5.1 Se connecter à Vercel avec GitHub

1. **Allez sur:** https://vercel.com
2. **Cliquez:** "Sign up" ou "Sign in"
3. **Connectez-vous avec GitHub:** Cliquez "Continue with GitHub"
4. **Autorisez Vercel** à accéder à votre compte GitHub

### 5.2 Importer le projet

1. **Dashboard Vercel** (après connexion)
2. **Cliquez:** "Add New" → "Project"
3. **Sélectionnez:** "Import Git Repository"
4. **Cherchez:** `baopixel-studio`
5. **Cliquez:** "Import"

### 5.3 Configuration du build

Vercel pré-remplira automatiquement:
- **Framework:** Next.js ✓
- **Build Command:** `npm run build` ✓
- **Output Dir:** `.next` ✓

**Cliquez:** "Deploy" → Vercel démarre le build (~2-3 min)

### 5.4 Ajouter les variables d'environnement

Une fois que le premier déploiement est terminé:

1. **Vercel Dashboard** → Sélectionnez `baopixel-studio`
2. **Allez à:** Settings → Environment Variables
3. **Ajouter:** 
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Votre clé API Anthropic (de https://console.anthropic.com/keys)
   - **Environments:** Cochez ☑️ Production, Preview, Development
4. **Cliquez:** "Add"
5. **Redéployer:** Allez à Deployments → Cliquez sur "..." du déploiement en cours → Redeploy

---

## 🤖 Étape 6: Configure GitHub Actions (CI/CD automatique - Optionnel)

### 6.1 Générer un Vercel Token

1. **Allez sur:** https://vercel.com/account/tokens
2. **Cliquez:** "Create"
3. **Remplissez:**
   - **Token name:** `github-actions-deploy`
4. **Copiez le token**

### 6.2 Ajouter le token comme Secret GitHub

1. **GitHub:** https://github.com/baopixelagency/baopixel-studio/settings/secrets/actions
2. **Cliquez:** "New repository secret"
3. **Ajouter:**
   - **Name:** `VERCEL_TOKEN`
   - **Value:** Collez votre token Vercel
4. **Cliquez:** "Add secret"

### 6.3 Tester le workflow

Faites maintenant un push de test:

```bash
git add .
git commit -m "test: Test GitHub Actions workflow"
git push origin main
```

Allez sur GitHub → Onglet "Actions" → Vous devriez voir votre workflow s'exécuter!

---

## 🎯 Résumé des commandes essentielles

```bash
# Cloner le dépôt (pour les autres développeurs)
git clone https://github.com/baopixelagency/baopixel-studio.git

# Mettre à jour votre local
git pull origin main

# Créer une branche pour une feature
git checkout -b feat/ma-feature

# Commiter vos changements
git add .
git commit -m "feat: Description de la feature"

# Pousser votre branche
git push origin feat/ma-feature
# Puis créer une Pull Request sur GitHub

# Merger dans main (après review)
git checkout main
git merge feat/ma-feature
git push origin main
# Auto-déploie sur Vercel!
```

---

## 🔗 Liens rapides

| Service | URL |
|---------|-----|
| Dépôt GitHub | https://github.com/baopixelagency/baopixel-studio |
| Dashboard Vercel | https://vercel.com/baopixelagency/baopixel-studio |
| Actions GitHub | https://github.com/baopixelagency/baopixel-studio/actions |
| Production en direct | https://baopixel-studio.vercel.app |
| API Anthropic | https://console.anthropic.com |

---

## ⚠️ Dépannage

### Erreur: "fatal: remote already exists"
```bash
git remote remove origin
git remote add origin https://github.com/baopixelagency/baopixel-studio.git
```

### Erreur: "fatal: Authentication failed"
- Vérifiez que votre PAT est correct
- Assurez-vous que le token n'a pas expiré
- Générez un nouveau token si nécessaire

### Erreur: "401 Unauthorized" sur Vercel
- Vérifiez le `VERCEL_TOKEN` dans GitHub Secrets
- Assurez-vous qu'il est correctement copié (sans espaces)
- Régénérez un nouveau token si nécessaire

---

**Configuration complétée! Votre pipeline CI/CD est maintenant en place.** ✨
