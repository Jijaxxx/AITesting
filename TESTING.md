# Guide de Test - Reading Games

## 🧪 Test de la Sauvegarde de Progression

### Prérequis
1. ✅ Serveur backend démarré sur `http://localhost:3000`
2. ✅ Client démarré sur `http://localhost:5174`
3. ✅ Profil utilisateur créé

### Étapes de Test

#### 1. **Accéder aux Reading Games**
- Ouvrir `http://localhost:5174`
- Sélectionner un profil
- Cliquer sur "📚 Jeux de Lecture ✨"

#### 2. **Lancer MagicSound**
- Sur la page Reading Games Home
- Cliquer sur "Jouer" pour MagicSound
- Vérifier que le jeu se charge

#### 3. **Jouer le Jeu**
- Écouter le son (cliquer sur le bouton son)
- Sélectionner la lettre correspondante
- Jouer les 8 rounds jusqu'au bout

#### 4. **Vérifier la Sauvegarde**
Ouvrir la **Console du navigateur** (F12) et vérifier les logs:

```
🎮 Game finished, saving progress...
  {
    userId: "...",
    gameSlug: "magic-sound",
    stars: 3,
    score: 100,
    completed: true
  }

📊 Saving Reading Games progress:
  {
    gameSlug: "magic-sound",
    level: 1,
    stars: 3,
    score: 100,
    profileId: "..."
  }

✅ Progress saved successfully
✅ Progress saved, navigating back...
```

#### 5. **Vérifier l'Affichage de la Progression**
Après retour sur Reading Games Home:
- Les étoiles doivent s'afficher sous MagicSound (⭐⭐⭐)
- Le bouton doit changer de "Jouer" à "Rejouer"

#### 6. **Vérifier la Page Progression**
- Cliquer sur "📊 Ma Progression"
- Vérifier les stats globales :
  - Total étoiles : devrait afficher les étoiles gagnées
  - Jeux terminés : devrait afficher 1/6
  - Progression globale : pourcentage calculé
- Vérifier le détail de MagicSound :
  - Icône ✅ (complété)
  - Étoiles affichées
  - Meilleur score visible

### 🐛 Débogage

#### Si la progression ne se sauvegarde pas:

**1. Vérifier le serveur backend**
```powershell
# Dans un terminal
cd c:\.github\AITesting\server
npm run dev
```

Devrait afficher:
```
🚀 Server running on port 3000 in development mode
📍 API endpoint: http://localhost:3000/api
```

**2. Vérifier les requêtes réseau**
- Ouvrir les DevTools (F12)
- Onglet "Network"
- Filtrer par "progress"
- Jouer et finir MagicSound
- Chercher une requête POST vers `/api/progress`
- Vérifier le statut (devrait être 200 ou 201)

**3. Vérifier la base de données**
```powershell
cd c:\.github\AITesting\server
npx prisma studio
```

Chercher dans la table `Progress`:
- `world = 4` (Reading Games)
- `level = 1` (MagicSound)
- `profileId` correspond au profil utilisé

**4. Vérifier le profil sélectionné**
Dans la console:
```javascript
// Vérifier que currentProfile existe
console.log(localStorage.getItem('profile-storage'))
```

### 📋 Checklist Complète

- [ ] Serveur backend démarré (port 3000)
- [ ] Client démarré (port 5174)
- [ ] Profil créé et sélectionné
- [ ] Navigation vers Reading Games fonctionne
- [ ] MagicSound se lance correctement
- [ ] Jeu jouable (8 rounds)
- [ ] Écran de fin s'affiche avec étoiles
- [ ] Logs de sauvegarde dans la console
- [ ] Requête POST `/api/progress` réussie (Network tab)
- [ ] Retour à Reading Games Home
- [ ] Étoiles affichées sous MagicSound
- [ ] Page Progression affiche les stats
- [ ] Rejouer le jeu met à jour le score si meilleur

### ✅ Test Réussi Si:

1. ✅ Les logs apparaissent dans la console
2. ✅ La requête réseau réussit (200/201)
3. ✅ Les étoiles s'affichent sur Reading Games Home
4. ✅ La page Progression montre le bon score
5. ✅ Rejouer le jeu conserve la progression

---

## 🎯 Prochains Tests

### Phase 2
- [ ] Tester GestureToLetter quand implémenté
- [ ] Tester HiddenWords quand implémenté
- [ ] Vérifier l'agrégation des scores sur plusieurs jeux

### Phase 3
- [ ] Tests de performance (beaucoup de jeux joués)
- [ ] Tests de synchronisation offline/online
- [ ] Tests d'export/import de données
