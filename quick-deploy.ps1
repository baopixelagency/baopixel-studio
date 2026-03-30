#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de déploiement complet BaoPixel Studio vers GitHub + Vercel
.DESCRIPTION
    Automatise la configuration et le déploiement du projet
.PARAMETER GitHubUsername
    Votre nom d'utilisateur GitHub (ex: baopixelagency)
.PARAMETER GitHubToken
    Votre Personal Access Token GitHub
.EXAMPLE
    .\quick-deploy.ps1 -GitHubUsername baopixelagency -GitHubToken ghp_xxxx...
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$true)]
    [securestring]$GitHubToken
)

$ErrorActionPreference = "Stop"

# Convertir le token sécurisé
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($GitHubToken))

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host " BaoPixel Studio - Quick Deploy" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Étape 1: Vérifier Git
Write-Host "[1/4] Vérifier Git..." -ForegroundColor Yellow
$gitVersion = git --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Git n'est pas installé!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Git détecté: $gitVersion" -ForegroundColor Green

# Étape 2: Configurer l'URL distante
Write-Host ""
Write-Host "[2/4] Configurer l'URL GitHub..." -ForegroundColor Yellow
$repoUrl = "https://${GitHubUsername}:${plainToken}@github.com/${GitHubUsername}/baopixel-studio.git"
$repoUrlDisplay = "https://github.com/${GitHubUsername}/baopixel-studio.git"

try {
    git remote remove origin 2>$null
    git remote add origin "$repoUrl"
    Write-Host "✓ URL configurée: $repoUrlDisplay" -ForegroundColor Green
} catch {
    Write-Host "✗ Erreur lors de la configuration: $_" -ForegroundColor Red
    exit 1
}

# Étape 3: Pousser le code
Write-Host ""
Write-Host "[3/4] Pousser le code vers GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host "✓ Code poussé avec succès!" -ForegroundColor Green
} catch {
    Write-Host "✗ Erreur lors du push:" -ForegroundColor Red
    Write-Host $_ -ForegroundColor Red
    Write-Host ""
    Write-Host "Vérifiez que:" -ForegroundColor Yellow
    Write-Host "1. Le dépôt existe: $repoUrlDisplay" -ForegroundColor Yellow
    Write-Host "2. Votre token est valide" -ForegroundColor Yellow
    Write-Host "3. Vous avez les permissions de push" -ForegroundColor Yellow
    exit 1
}

# Étape 4: Afficher les prochaines étapes
Write-Host ""
Write-Host "[4/4] Récapitulatif" -ForegroundColor Yellow
Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host " ✓ Déploiement GitHub complété!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Informations:" -ForegroundColor Cyan
Write-Host "   Dépôt: $repoUrlDisplay" -ForegroundColor White
Write-Host "   Branche: main" -ForegroundColor White
Write-Host "   Commits: $(git log --oneline | wc -l)" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Allez sur Vercel: https://vercel.com/new" -ForegroundColor White
Write-Host "   2. Importez le dépôt: $repoUrlDisplay" -ForegroundColor White
Write-Host "   3. Configurez les variables d'environnement" -ForegroundColor White
Write-Host "   4. Cliquez 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "📚 Docs:" -ForegroundColor Cyan
Write-Host "   - GITHUB_SETUP.md: Configuration GitHub" -ForegroundColor White
Write-Host "   - DEPLOYMENT.md: Guide complet de déploiement" -ForegroundColor White
Write-Host ""

# Pause pour que l'utilisateur voie le message
Read-Host "Appuyez sur Entrée pour fermer"
