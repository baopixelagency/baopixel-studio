# Script automatise de deploiement GitHub

$token = "YOUR_GITHUB_TOKEN_HERE"
$username = "baopixelagency"
$repo = "baopixel-studio"
$projectPath = "c:\Users\tanor fall\Downloads\files\baopixel-studio-deploy\baopixel-studio"

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host " BaoPixel - Deployment" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

cd $projectPath

# ETAPE 1: Creer le depot GitHub
Write-Host "[1/3] Creer le depot GitHub..." -ForegroundColor Yellow

$repoData = @{
    name = "baopixel-studio"
    description = "BaoPixel Studio OS - Outil de gestion d'agence"
    private = $false
    auto_init = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Headers @{Authorization="token $token";"Content-Type"="application/json";Accept="application/vnd.github.v3+json"} -Body $repoData
    Write-Host "OK: Depot cree" -ForegroundColor Green
}
catch {
    Write-Host "NOTE: Depot existe probablement deja (OK)" -ForegroundColor Yellow
}

# ETAPE 2: Configurer le remote Git
Write-Host ""
Write-Host "[2/3] Configurer le remote Git..." -ForegroundColor Yellow

$repoUrl = "https://${token}@github.com/${username}/${repo}.git"
$repoUrlDisplay = "https://github.com/${username}/${repo}.git"

git remote remove origin 2>$null
git remote add origin $repoUrl

Write-Host "OK: Remote configure: $repoUrlDisplay" -ForegroundColor Green

# ETAPE 3: Pousser le code
Write-Host ""
Write-Host "[3/3] Pousser le code vers GitHub..." -ForegroundColor Yellow

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Code pousse avec succes" -ForegroundColor Green
} else {
    Write-Host "ERREUR: Push echoue" -ForegroundColor Red
    exit 1
}

# Resume
Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host " SUCCES: Deploiement GitHub!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

Write-Host "Recap:" -ForegroundColor Cyan
Write-Host "   Depot: https://github.com/$username/$repo" -ForegroundColor White
Write-Host "   Branche: main" -ForegroundColor White

Write-Host ""
Write-Host "Prochaine etape: Vercel" -ForegroundColor Cyan
Write-Host "   1. Allez sur: https://vercel.com/new" -ForegroundColor White
Write-Host "   2. Connectez-vous avec GitHub" -ForegroundColor White
Write-Host "   3. Importez: baopixel-studio" -ForegroundColor White
Write-Host "   4. Cliquez Deploy" -ForegroundColor White
Write-Host ""
