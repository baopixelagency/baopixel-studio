# ============================================================================
# BaoPixel Studio - Local Development Launcher
# Script PowerShell utilitaire pour lancer l'application en dev local
# ============================================================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🎬  BaoPixel Studio - Local Development Setup              ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Node.js est installé
Write-Host "⏳ Vérification de Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Node.js n'est pas installé!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installation rapide:" -ForegroundColor Cyan
    Write-Host "  1. Visitez: https://nodejs.org/" -ForegroundColor White
    Write-Host "  2. Téléchargez la version LTS" -ForegroundColor White
    Write-Host "  3. Installez et redémarrez PowerShell" -ForegroundColor White
    Write-Host ""
    Write-Host "Ou via Chocolatey (Mode Admin requis):" -ForegroundColor Cyan
    Write-Host "  choco install nodejs" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ Node.js $nodeVersion trouvé" -ForegroundColor Green
Write-Host "✅ npm $(npm --version) trouvé" -ForegroundColor Green
Write-Host ""

# Changer de répertoire si nécessaire
$projectPath = "c:\Users\tanor fall\Downloads\files\baopixel-studio-deploy\baopixel-studio"
if ((Get-Location).Path -ne $projectPath) {
    Write-Host "📁 Navigation vers le projet..." -ForegroundColor Yellow
    Set-Location $projectPath
}

# Vérifier si node_modules existe
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    Write-Host ""
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation!" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Nettoyer le cache .next
if (Test-Path ".next") {
    Write-Host "🧹 Nettoyage du cache..." -ForegroundColor Yellow
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ Démarrage du serveur de développement                    ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Application disponible à: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📝 Fichier d'aide: LOCAL_SETUP.md" -ForegroundColor Cyan
Write-Host "🎨 Démo HTML: preview.html (double-clic pour ouvrir)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""

# Lancer le serveur de développement
npm run dev
