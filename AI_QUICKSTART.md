# ✨ Quick Start - IA en Production

## 🎯 3 Étapes Rapides pour Activer l'IA

### ÉTAPE 1: Créer une clé API Anthropic

```
1. Allez sur: https://console.anthropic.com
2. Créez un compte OR connectez-vous
3. Allez sur "API Keys"
4. Cliquez "Create Key"
5. Donnez un nom: "BaoPixel Production"
6. Copiez la clé (commence par sk-ant-...)
```

⏱️ **Temps:** ~2 minutes

---

### ÉTAPE 2: Ajouter la clé sur Vercel

```
1. Allez sur: https://vercel.com
2. Sélectionnez le projet "baopixel-studio"
3. Cliquez Settings (en haut)
4. Allez à: Environment Variables
5. Cliquez "Add New"

C'est ICI qu'on ajoute:
   Name:      ANTHROPIC_API_KEY
   Value:     sk-ant-.... (copiez votre clé d'étape 1)
   Environments: ✓ Production ✓ Preview ✓ Development

6. Cliquez "Add"
7. Vercel va redéployer automatiquement (~1 min)
```

⏱️ **Temps:** ~5 minutes

---

### ÉTAPE 3: Tester que ça marche

```
1. Attendez que Vercel finisse de redéployer
2. Allez sur: https://baopixel-studio.vercel.app
3. Déverrouillez avec votre PIN (si configuré)
4. Naviguez vers "✦ Veille IA Réseaux" (menu de gauche)
5. Sélectionnez "Instagram"
6. Cliquez "✦ Lancer la veille Instagram"
7. Attendez ~10 secondes

✅ Si vous recevez des actualités → IA FONCTIONNE! 🎉
❌ Si erreur → Vérifiez que ANTHROPIC_API_KEY est bien ajoutée

```

⏱️ **Temps:** ~2 minutes

---

## 🚀 Les 5 modules IA qu'on peut utiliser TOUT DE SUITE

| # | Module | Description | Où trouver |
|---|--------|-----------|----------|
| 1 | **✦ Veille IA** | Actualités réseaux sociaux | Menu gauche → ✦ Veille IA Réseaux |
| 2 | **📖 Guide Algo** | Comment maximiser reach | Menu gauche → 📖 Guide Algorithmes |
| 3 | **📈 Reporting** | Générer rapports clients | Menu gauche → 📈 Reporting Clients |
| 4 | **📁 Decks & Docs** | Générer propositions, devis | Menu gauche → 📁 Decks & Docs |
| 5 | **💬 Chat IA** | (À ajouter) Demander n'importe quoi | À venir |

---

## 📝 Checklist Finale

```
CONFIGURATION
  [ ] Clé Anthropic créée
  [ ] Clé ajoutée sur Vercel (ANTHROPIC_API_KEY)
  [ ] Vercel a redéployé (vérifier Deployments)
  [ ] App accessible: https://baopixel-studio.vercel.app

TEST
  [ ] Veille IA fonctionne (✓ actualités reçues)
  [ ] Guide Algo fonctionne (✓ conseil reçu)
  [ ] Reporting fonctionne (✓ rapport généré)
  [ ] Decks fonctionne (✓ document généré)

UTILISATION
  [ ] Comprendre comment chaque module fonctionne
  [ ] Commencer à l'utiliser pour vrais clients
  [ ] Adapter les prompts à vos besoins
  [ ] Entraîner l'équipe (Norta, etc.)
```

---

## 🔧 Troubleshooting Rapide

### ❌ "Erreur IA" ou "Réponse indisponible"

**Solution 1:** Vérifier Vercel
```
1. Allez sur https://vercel.com
2. Projet "baopixel-studio"
3. Onglet "Deployments"
4. Cliquez sur le déploiement récent
5. Vérify que ça dit "Ready" (pas "Error")
```

**Solution 2:** Vérifier la variable d'env
```
1. Settings → Environment Variables
2. Vérifiez que ANTHROPIC_API_KEY existe
3. La valeur commence par "sk-ant-"?
4. Si OK → Redéployer: Deployments → "..." → "Redeploy"
```

**Solution 3:** Vérifier la clé API
```
1. Allez sur https://console.anthropic.com/keys
2. Votre clé est là?
3. La clé a-t-elle un statut dans le rouge?
4. Si doute, générez une NOUVELLE clé
5. Remettez-la sur Vercel (étape 2 ci-dessus)
```

### ❌ "timeout" ou "trop lent"

Normal! Anthropic prend parfois 10-20 secondes. Attendez. Si >30sec, vérifiez votre connexion internet.

### ❌ Les autres modules (CRM, Agenda, etc.) fonctionnent mais pas l'IA

Vérifiez que vous êtes bien sur les bonnes pages:
- "✦ Veille IA" (pas dans "Veille IA" ailleurs)
- "📖 Guide Algorithmes" (exact)
- "📈 Reporting" (exact)
- "📁 Decks & Docs" (exact)

---

## 💡 Tips d'Utilisation

### Prompt = Résultat

Plus votre prompt est **précis** → meilleur résultat!

```
❌ Mauvais:
"Donne-moi des idées de contenu"

✅ Bon:
"Donne-moi 5 idées de Reels pour So Suite Hôtel (4 étoiles Sénégal).
Objectif: plus de réservations. Format court: titre + angle + durée."
```

### Contexte personnalisé

Toutes les réponses IA doivent considérer:
- Votre localisation (Mbour, Petite-Côte)
- Vos clients (agences immo, hôtels, restau)
- Votre budget (150k-500k FCFA)
- Votre agence (BaoPixel, spécialiste vidéo/drone)

---

## 🎓 Documentation Complète

Pour aller plus loin:
- **AI_INTEGRATION_GUIDE.md** - Guide complet de configuration
- **AI_PROMPT_EXAMPLES.md** - 50+ exemples de prompts
- **API Claude Docs:** https://docs.anthropic.com/

---

## 📞 Support Rapide

Si ça ne marche pas:

```
1. Vérifiez le checklist en haut ↑
2. Essayez le troubleshoot Rapide
3. Vérifiez que le token n'a pas expiré
4. Générez une nouvelle clé Anthropic (https://console.anthropic.com/keys)
5. Remettez-la sur Vercel
6. Redéployez
7. Attendez 2 min et réessayez
```

---

## 🎉 Bravo!

Vous avez une **app complète avec IA intégrée**, déployée en production sur Vercel!

Prochaines étapes:
1. Utilisez chaque module
2. Collectez des feedbacks
3. Adaptez les prompts
4. Entraînez votre équipe
5. Automatisez plus de processus IA

**Besoin d'aide?** Relisez les guides ou modifiez directement le code dans `app/page.tsx` 🚀
