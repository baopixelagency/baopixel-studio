#!/bin/bash
# Script de déploiement BaoPixel Studio vers GitHub

echo ""
echo "===================================="
echo " BaoPixel Studio - GitHub Deployment"
echo "===================================="
echo ""

# Vérifier les paramètres
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh GITHUB_USERNAME"
    echo "Exemple: ./deploy.sh baopixel"
    echo ""
    exit 1
fi

GITHUB_USERNAME=$1
REPO_URL="https://github.com/$GITHUB_USERNAME/baopixel-studio.git"

echo "[1/3] Configurer l'URL distante GitHub..."
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"
echo "✓ URL configurée"

echo ""
echo "[2/3] Pousser le code vers GitHub..."
if ! git push -u origin main; then
    echo "✗ Erreur lors du push. Vérifiez:"
    echo "  - Le dépôt existe sur GitHub: $REPO_URL"
    echo "  - Vous avez les permissions de push"
    echo "  - Votre authentification GitHub est configurée"
    exit 1
fi
echo "✓ Code pushé avec succès"

echo ""
echo "===================================="
echo " ✓ Déploiement GitHub complété!"
echo "===================================="
echo ""
echo "Prochaines étapes:"
echo "1. Allez sur Vercel: https://vercel.com/new"
echo "2. Importez le dépôt: https://github.com/$GITHUB_USERNAME/baopixel-studio"
echo "3. Configurez les variables d'environnement"
echo "4. Cliquez \"Deploy\""
echo ""
echo "Documentation: Voir DEPLOYMENT.md"
echo ""
