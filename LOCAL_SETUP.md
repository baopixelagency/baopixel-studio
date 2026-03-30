# 🚀 Setup Local Development - BaoPixel Studio

## 📋 Prérequis

### Windows
Vous avez besoin de **Node.js** (v18+ recommandé)

**Option 1: Installer via Chocolatey (rapide)**
```powershell
# Ouvrez PowerShell en mode Admin et exécutez:
choco install nodejs
```

**Option 2: Installer manuellement**
1. Téléchargez de: https://nodejs.org/
2. Choisissez la version **LTS (Long Term Support)**
3. Installez en cliquant sur Next → Finish
4. Redémarrez PowerShell après installation

**Vérification:**
```powershell
node --version
npm --version
```

---

## 🎯 Setup Rapide (3 étapes)

### 1. Installez les dépendances
```powershell
cd "c:\Users\tanor fall\Downloads\files\baopixel-studio-deploy\baopixel-studio"
npm install
```

### 2. Lancez le serveur de développement
```powershell
npm run dev
```

### 3. Ouvrez dans le navigateur
```
http://localhost:3000
```

---

## 🛠️ Commandes Utiles

```powershell
# Démarrage en développement (avec auto-reload)
npm run dev

# Build pour production
npm run build

# Lancer la version production
npm run start

# Nettoyer le cache
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
```

---

## 🌐 Accès Local

| Fonction | URL |
|----------|-----|
| **Application** | http://localhost:3000 |
| **Console d'erreurs** | Ctrl+Shift+I (DevTools) |
| **Arrêt du serveur** | Ctrl+C dans le terminal |

---

## 🎨 Tester les Fonctionnalités

### Theme Toggle
- Cliquez sur le bouton 🌙/☀️ dans la sidebar (bas à gauche)
- Le thème se sauvegarde dans le localStorage
- Rafraîchissez (Ctrl+R) - le thème persiste

### Design System
- Ouvrez `preview.html` dans le navigateur pour voir tous les composants
- Testez le responsive design (F12 → Toggle Device Toolbar)

---

## 📂 Structure du Projet

```
baopixel-studio/
├── app/
│   ├── context/
│   │   └── ThemeContext.tsx      # Gestion du thème
│   ├── globals.css              # Design system v3
│   ├── layout.tsx               # Layout root avec ThemeProvider
│   └── page.tsx                 # Application principale
├── components/
│   ├── ThemeToggle.tsx          # Bouton toggle thème
│   └── Navbar.tsx               # Navigation
├── preview.html                 # Demo HTML locale
├── package.json
├── tsconfig.json
└── next.config.js
```

---

## 🔍 Debug & Troubleshooting

### Port 3000 déjà utilisé?
```powershell
# Utiliser un autre port
npm run dev -- -p 3001
```

### Cache corrompu?
```powershell
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
npm run dev
```

### Erreur "React not found"?
```powershell
npm install
npm run dev
```

---

## 📝 Notes Importantes

- **Développement**: Ne pas modifier `next.config.js` ou `package.json`  
- **Dépôt Git**: Les changements locaux ne synchronisent pas automatiquement
- **Déploiement**: Les changements locaux doivent être push sur GitHub pour Vercel

---

## 🚀 Prochaines Étapes

1. ✅ Installer Node.js
2. ✅ Exécuter `npm install`
3. ✅ Lancer `npm run dev`
4. ✅ Ouvrir http://localhost:3000
5. ✅ Tester le design & le toggle thème

**Support**: Consultez la documentation Next.js: https://nextjs.org/docs
