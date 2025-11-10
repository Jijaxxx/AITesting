# 🚀 Lancer le Projet - Guide Rapide

## Option 1: Installation Automatique (Recommandé)

```powershell
# Depuis c:\.github\AITesting\
.\setup.ps1
```

Ce script va automatiquement:
1. ✅ Installer toutes les dépendances npm (root, server, client)
2. ✅ Démarrer PostgreSQL avec Docker
3. ✅ Générer le Prisma Client
4. ✅ Exécuter les migrations de base de données
5. ✅ Insérer les données de seed (12 niveaux, 10 compétences)

Durée estimée: **3-5 minutes**

---

## Option 2: Installation Manuelle

### Étape 1: Dépendances
```powershell
npm install
cd server; npm install; cd ..
cd client; npm install; cd ..
```

### Étape 2: PostgreSQL
```powershell
docker-compose up -d
```

Vérifier que le container est lancé:
```powershell
docker ps
```

Vous devez voir un container `lectio-postgres` avec status `Up`.

### Étape 3: Base de données
```powershell
cd server

# Générer le client Prisma
npm run prisma:generate

# Créer les tables
npm run prisma:migrate

# Insérer les données initiales
npm run seed

cd ..
```

Vous devriez voir:
```
🌱 Seeding database...
✅ 10 compétences créées
✅ 12 niveaux créés
📖 60 mots de vocabulaire disponibles
🎉 Seed terminé avec succès!
```

---

## Démarrer le Projet

### Mode Développement (Backend + Frontend)
```powershell
npm run dev
```

Cela démarre automatiquement:
- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173

### Démarrer uniquement le Backend
```powershell
npm run server
```

### Démarrer uniquement le Frontend
```powershell
npm run client
```

---

## Vérification Rapide

### 1. Backend API
Ouvrir http://localhost:3000/health

Vous devez voir:
```json
{"status":"ok","timestamp":"2025-01-..."}
```

### 2. Frontend
Ouvrir http://localhost:5173

Vous devez voir la page de sélection des profils (vide au départ).

### 3. Base de données (optionnel)
```powershell
cd server
npm run prisma:studio
```

Ouvre Prisma Studio sur http://localhost:5555 pour visualiser les données.

Vous verrez:
- **LevelDef:** 12 enregistrements (3 mondes × 4 niveaux)
- **Skill:** 10 enregistrements (5 voyelles + 5 digrammes)
- **Profile, Progress, Reward, ErrorStat:** Vides (à créer via l'interface)

---

## Créer votre Premier Profil

### Via l'interface (pas encore fonctionnelle - placeholder)
1. Ouvrir http://localhost:5173
2. Cliquer "Nouveau profil"
3. Saisir prénom, âge, choisir avatar
4. Valider

### Via Prisma Studio (pour tester)
1. Ouvrir http://localhost:5555
2. Aller dans `Profile`
3. Cliquer "Add record"
4. Remplir:
   - `pseudo`: "Alice"
   - `age`: 6
   - `avatarKey`: "avatar_001"
   - `settings`: `{"fontSize":"normal","contrast":"normal","motionReduced":false,"sessionDuration":15}`
5. Sauvegarder

Un enregistrement `Reward` vide sera créé automatiquement.

### Via API (curl/Postman)
```powershell
curl -X POST http://localhost:3000/api/profiles `
  -H "Content-Type: application/json" `
  -d '{\"pseudo\":\"Alice\",\"age\":6,\"avatarKey\":\"avatar_001\"}'
```

---

## Tester la Progression

### Enregistrer une progression de niveau
```powershell
curl -X POST http://localhost:3000/api/progress `
  -H "Content-Type: application/json" `
  -d '{\"profileId\":\"<ID_PROFIL>\",\"world\":1,\"level\":1,\"stars\":3,\"xp\":100}'
```

Remplacer `<ID_PROFIL>` par l'ID du profil créé (visible dans Prisma Studio ou réponse de création).

### Récupérer toute la progression d'un profil
```bash
curl http://localhost:3000/api/progress?profileId=<ID_PROFIL>
```

---

## Arrêter le Projet

### Arrêter les serveurs dev
Appuyer sur `Ctrl+C` dans le terminal où tourne `npm run dev`.

### Arrêter PostgreSQL
```powershell
docker-compose down
```

Pour supprimer aussi les données:
```powershell
docker-compose down -v
```

---

## Problèmes Fréquents

### "Port 3000 already in use"
```powershell
# Trouver le processus
netstat -ano | findstr :3000

# Tuer le processus (remplacer <PID>)
taskkill /PID <PID> /F
```

Ou changer le port dans `server/.env`:
```
PORT=3001
```

### "Port 5432 already in use" (PostgreSQL)
Un PostgreSQL local tourne déjà. Options:
1. L'arrêter et utiliser Docker
2. Modifier `docker-compose.yml`:
   ```yaml
   ports:
     - "5433:5432"  # Exposer sur 5433 au lieu de 5432
   ```
   Puis mettre à jour `server/.env`:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/lectio_mvp
   ```

### "Cannot connect to database"
1. Vérifier Docker container: `docker ps`
2. Attendre 5 secondes que PostgreSQL démarre
3. Vérifier `DATABASE_URL` dans `server/.env`

### Erreurs TypeScript dans VS Code
C'est normal avant l'installation des dépendances. Après `npm install`, relancer VS Code ou:
```
Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

---

## Étapes Suivantes

Une fois le projet lancé avec succès:

1. **Tester les API endpoints** (voir `archi/api-specification.md`)
2. **Implémenter le premier mini-jeu** (LotoSons.tsx)
3. **Créer les composants UI** (AvatarGrid, LevelTile)
4. **Ajouter Web Speech API** pour TTS
5. **Configurer PWA** pour offline

---

## Ressources

- 📚 **Documentation complète:** `README.md`, `SETUP.md`
- 🏗️ **Architecture:** `archi/`
- 📊 **État du projet:** `PROJECT_STATUS.md`
- 🔧 **API Spec:** `archi/api-specification.md`
- 🗄️ **Schema DB:** `archi/database-schema.md`

---

**Besoin d'aide?** Consultez `SETUP.md` pour le guide détaillé pas à pas.
