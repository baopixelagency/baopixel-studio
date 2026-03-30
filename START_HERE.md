📋 **INSTRUCTIONS DE DÉPLOIEMENT RAPIDE - BaoPixel Studio**

================================
 🚀 PRÊT POUR LE DÉPLOIEMENT
================================

Votre username GitHub: **baopixelagency**

Tous les fichiers sont prêts. Voici les 3 étapes finales:

---

## ✅ ÉTAPE 1: Créer un Personal Access Token

1. Allez sur: https://github.com/settings/tokens
2. Cliquez "Generate new token (classic)"
3. Généralement des permissions à cocher:
   ✓ repo
   ✓ admin:repo_hook
   ✓ workflow
4. Copiez le token généré (ex: ghp_xxxx...)

---

## ✅ ÉTAPE 2: Créer le dépôt GitHub

1. Allez sur: https://github.com/new
2. Repository name: baopixel-studio
3. Levez Public ou Private
4. ❌ Décochez "Initialize with README"
5. Cliquez "Create repository"

---

## ✅ ÉTAPE 3: Pousser le code

**Option A (Script PowerShell automatisé):**

```powershell
# Ouvrir PowerShell dans le dossier du projet
cd "c:\Users\tanor fall\Downloads\files\baopixel-studio-deploy\baopixel-studio"

# Exécuter le script (remplacez par votre token)
.\quick-deploy.ps1 -GitHubUsername baopixelagency -GitHubToken "ghp_xxxx..."
```

**Option B (Commandes manuelles):**

```powershell
cd "c:\Users\tanor fall\Downloads\files\baopixel-studio-deploy\baopixel-studio"

# Configurer Git credential helper
git config --global credential.helper wincred

# Ajouter l'URL du dépôt
git remote add origin https://github.com/baopixelagency/baopixel-studio.git

# Pousser le code
git push -u origin main

# (Vous serez invité à entrer votre token GitHub comme mot de passe)
```

---

## 🎯 APRÈS LE PUSH VERS GITHUB

Une fois le push réussi:

1. Allez sur: https://vercel.com
2. Connectez-vous avec GitHub
3. Cliquez "New Project"
4. Cliquez "Import Git Repository"
5. Sélectionnez "baopixel-studio"
6. Vercel détectera automatiquement Next.js
7. Cliquez "Deploy"
8. Attendez la completion (~2-3 min)

---

## 📚 DOCUMENTATION

Voir les fichiers:
- **GITHUB_SETUP.md** - Guide détaillé d'authentification GitHub
- **DEPLOYMENT.md** - Guide complet Vercel et CI/CD
- **.github/workflows/deploy.yml** - GitHub Actions workflow

---

## 🔗 URLS IMPORTANTES

Une fois deployé:
- GitHub: https://github.com/baopixelagency/baopixel-studio
- Vercel: https://vercel.com/dashboard (après connexion)
- App Live: https://baopixel-studio.vercel.app

---

## ❓ AIDE RAPIDE

**"fatal: Authentication failed"**
→ Vérifiez votre token GitHub, assurez-vous qu'il n'a pas expiré

**"fatal: remote already exists"**
→ git remote remove origin
→ Puis réessayez

**"The specified repository does not exist"**
→ Assurez-vous que vous avez créé https://github.com/baopixelagency/baopixel-studio

---

**Status** ✨
- [x] Projet initialisé en Git
- [x] Code commité
- [x] GitHub Actions configuré
- [x] Vercel prêt
- [ ] Code pushé vers GitHub (À FAIRE)
- [ ] Déployé sur Vercel (À FAIRE)

Prêt? Commencez par ÉTAPE 1 ci-dessus! 🚀
