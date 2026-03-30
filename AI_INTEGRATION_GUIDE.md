# 🤖 Guide d'Intégration IA - BaoPixel Studio

## ✅ État Actuel

L'IA est **déjà intégrée** dans votre app! Voici ce qui existe:

### API Anthropic configurée
- **Modèle:** Claude Sonnet 4 (claude-sonnet-4-20250514)
- **Route:** `/api/ai` (POST)
- **URL:** `https://api.anthropic.com/v1/messages`
- **Max tokens:** 2048
- **Authentification:** Via `ANTHROPIC_API_KEY`

### Modules IA actifs

| Module | Fonction | Intégration |
|--------|----------|-----------|
| **Veille IA** | Actualités réseaux sociaux | ✅ Complète |
| **Guide Algo** | Conseils algorithmes Instagram/TikTok | ✅ Complète |
| **Reporting** | Génération rapports clients | ✅ Complète |
| **Decks & Docs** | Génération documents professionnels | ✅ Complète |

---

## 🚀 Configuration en Production (Vercel)

### Étape 1: Ajouter la clé API sur Vercel

```
1. Dashboard Vercel → baopixel-studio
2. Settings → Environment Variables
3. Ajouter une variable:
   - Name: ANTHROPIC_API_KEY
   - Value: sk-ant-... (voir below)
   - Environments: Production, Preview, Development
4. Cliquer "Add"
5. Redéployer (Deployments → ...)
```

### Étape 2: Générer la clé API Anthropic

```
1. Aller sur: https://console.anthropic.com/keys
2. Créer une nouvelle clé: "BaoPixel Production"
3. Copier la clé (commence par sk-ant-)
4. Coller sur Vercel (ci-dessus)
```

### Étape 3: Tester la configuration

Une fois Vercel redéployé:
1. Allez sur `https://baopixel-studio.vercel.app`
2. Naviguez vers "✦ Veille IA" 
3. Cliquez "Lancer la veille Instagram"
4. Vous devriez recevoir une réponse en ~10 secondes

---

## 💡 Comment Utiliser l'IA dans l'App

### 1️⃣ Veille IA (✦ Veille IA Réseaux)

**Cas d'usage:** Rester à jour sur les algorithmes des réseaux

```
- Sélectionnez un réseau: Instagram / TikTok / Facebook / LinkedIn
- Cliquez "Lancer la veille"
- L'IA génère les 5 dernières actualités + impact pour BaoPixel
```

**Sytaxe du prompt:**
```
"Donne-moi les 5 dernières actualités concernant {réseau} 
pour les créateurs de contenu et agences digitales en Afrique. 
Format: 📌 Titre → Explication → Impact pour BaoPixel"
```

### 2️⃣ Guide Algo (📖 Guide Algorithmes)

**Cas d'usage:** Comprendre comment maximiser la portée

```
- Sélectionnez un sujet parmi les 8 disponibles (ou tapez votre question)
- Cliquez "Demander"
- L'IA répond avec: Principe clé | Ce à faire | Ce à éviter | Astuce BaoPixel | Métriques
```

**Topics disponibles:**
- Algorithme Instagram 2026
- Algorithme TikTok 2026
- Meilleure heure de publication
- Formats qui performent
- Reels vs Carrousels
- Augmenter l'engagement
- Hashtags efficaces
- Transition organique → payant

### 3️⃣ Reporting Clients (📈 Reporting)

**Cas d'usage:** Générer automatiquement des rapports professionnels

```
1. Saisir les stats: Abonnés, Reach, Engagement %, Posts
2. Cliquer "🤖 Générer rapport IA"
3. Rapport généré en ~15 secondes avec:
   - Résumé exécutif
   - Points forts
   - Points d'amélioration
   - Recommandations
   - Plan d'action 3 mois
```

**Données nécessaires:**
- Client
- Mois
- Abonnés (nombre)
- Reach (impression)
- Engagement (%)
- Posts (nombre)
- Notes (optionnel)

### 4️⃣ Decks & Docs (📁 Generateur)

**Cas d'usage:** Automatis la création de documents commerciaux

```
1. Sélectionnez le type de document:
   - Proposition commerciale
   - Présentation agence BaoPixel
   - Brief créatif client
   - Rapport mensuel
   - Stratégie contenu 3 mois
   - Onboarding client
   - Script de vente

2. Sélectionnez le client (ou "BaoPixel interne")

3. Cliquez "🤖 Générer le document"

4. Document généré en ~20 secondes

5. Actions disponibles:
   - 📋 Copier le texte
   - 🖨️ Imprimer sur papier
```

---

## 🔌 Intégration Personnalisée (Ajouter l'IA ailleurs)

### Comment intégrer l'IA dans d'autres modules?

**La fonction déjà disponible:**
```typescript
const askAI = async (prompt: string, system?: string): Promise<string> => {
  const r = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system })
  })
  const d = await r.json()
  return d.text || 'Réponse indisponible.'
}
```

**Exemple d'utilisation dans un module:**
```typescript
const [result, setResult] = useState('')
const [loading, setLoading] = useState(false)

const generateContent = async () => {
  setLoading(true)
  const prompt = "Ma demande personnalisée..."
  const systemPrompt = "Tu es un expert en..."
  const response = await askAI(prompt, systemPrompt)
  setResult(response)
  setLoading(false)
}

// Dans le JSX:
{loading && <Spinner/>}
{result && <div>{result}</div>}
<Btn onClick={generateContent}>Générer</Btn>
```

### Exemples de prompts personnalisés

**Pour Pipeline CRM:**
```javascript
const p = `Génère un script de prospection personnalisé pour "${client.nom}" 
(${client.secteur}) avec un budget de ${client.montant} FCFA. 
Agence: BaoPixel. Format: Message WhatsApp court + call-to-action.`
```

**Pour Editorial:**
```javascript
const p = `Donne-moi 5 idées de contenu pour la semaine pour ${client.nom}. 
Secteur: ${client.secteur}. 
Buget: ${client.montant} FCFA/mois.
Formats: Reels, Posts, Stories.
Platform: Instagram.`
```

**Pour Trésorerie:**
```javascript
const p = `Analyse-moi le cash-flow BaoPixel : 
CA ${month}: ${ca} FCFA.
Dépenses: ${depenses} FCFA.
Recommandations pour optimiser la profitabilité?`
```

---

## ⚙️ Configurations Avancées

### 1. Changer le modèle IA

File: [app/api/ai/route.ts](app/api/ai/route.ts)

```typescript
// Actuel
model: 'claude-sonnet-4-20250514'

// Alternatives disponibles:
model: 'claude-3-5-sonnet-20241022'  // Plus rapide, moins cher
model: 'claude-3-opus-20250219'      // Plus puissant, plus cher
model: 'claude-3-haiku-20250307'     // Ultra rapide
```

### 2. Augmenter les tokens

```typescript
max_tokens: 2048  // Actuel

// Pour des réponses plus longues:
max_tokens: 4096
```

### 3. Ajouter un système prompt global

```typescript
// Dans app/api/ai/route.ts
const systemPrompt = system || `Tu es l'IA de BaoPixel Digital Agency...`
```

### 4. Rate limiting (optionnel)

Pour éviter les abus:
```typescript
// Dans app/api/ai/route.ts
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requêtes/heure
})

const { success } = await ratelimit.limit('user:ip')
if (!success) return NextResponse.json({ error: 'Limite atteinte' }, { status: 429 })
```

---

## 🔒 Sécurité

### Check-list de sécurité

- ✅ **API Key sécurisée:** Stockée en variable d'environnement (Vercel)
- ✅ **Jamais exposée:** Seul le serveur appelle l'API Anthropic
- ✅ **Timeout:** Requêtes limées à ~30 secondes
- ✅ **Validation**: Vérifier que `d.content[0]?.text` existe
- ❓ **Rate limiting**: À ajouter si utilisation intensive

### Bonnes pratiques

```typescript
// ❌ Éviter
const apiKey = 'sk-ant-xxx' // Hardcodé!

// ✅ Faire
const apiKey = process.env.ANTHROPIC_API_KEY // En variable d'env

// ✅ Toujours valider
if (!response.ok) throw new Error(`API error: ${response.status}`)
if (!data.content[0]?.text) return 'Erreur: réponse vide'
```

---

## 📊 Coûts estimés

### Pricing Anthropic (au 30 mars 2026)

| Modèle | Input (1k tokens) | Output (1k tokens) |
|--------|------------------|------------------|
| Claude Sonnet 4 | ~$3 | ~$15 |
| Claude 3.5 Sonnet | ~$3 | ~$15 |
| Claude Haiku | ~$0.80 | ~$4 |

### Estimation BaoPixel

```
- Veille IA: ~500 tokens/analyse = ~$0.005
- Guide Algo: ~800 tokens/réponse = ~$0.012
- Reporting: ~1200 tokens/rapport = ~$0.018
- Decks: ~2000 tokens/document = ~$0.030

Total estimé: ~$0.065 par requête
Budget mensuel: ~$200/mois (3000 requêtes)
```

---

## 🐛 Dépannage

### "Erreur IA" ou "Réponse indisponible"

```
1. Vérifier que ANTHROPIC_API_KEY est configurée sur Vercel
2. Vérifier que la clé n'a pas expiré
3. Vérifier la console (F12 → Network → /api/ai)
```

### "Connexion timeout"

```
1. Vérifier votre connexion internet
2. Anthropic peut être surchargé (rare)
3. Essayez dans 30 secondes
```

### "Model not found"

```
1. Verifier le nom exact du modèle dans route.ts
2. La clé API doit permettre ce modèle
3. Contacter: support@anthropic.com
```

---

## 📚 Ressources

- **Docs Anthropic:** https://docs.anthropic.com/
- **API Keys:** https://console.anthropic.com/keys
- **Models:** https://docs.anthropic.com/en/docs/about/models/overview
- **Prompting guide:** https://docs.anthropic.com/en/docs/build-a-basic-ai-chat-bot

---

## ✨ Prochaines étapes

### Immédiat
- [ ] Ajouter ANTHROPIC_API_KEY sur Vercel
- [ ] Tester Veille IA depuis Vercel
- [ ] Vérifier que tous les modules fonctionnent

### À court terme
- [ ] Customiser les system prompts pour BaoPixel
- [ ] Tester avec vrais clients dans Reporting
- [ ] Optimiser les prompts basés sur feedback

### À moyen terme
- [ ] Ajouter l'IA au Pipeline CRM (scripts prospects)
- [ ] Ajouter l'IA au Calendrier Éditorial (idées contenu)
- [ ] Ajouter historique des requêtes IA

---

**🎉 Votre app avec IA est prête!** Déployez-la et utilisez-la. 🚀
