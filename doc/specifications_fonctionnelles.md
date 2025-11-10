# Spécifications fonctionnelles

## Titre
Application web ludique pour apprendre à lire (3–10 ans)

## Objectif
Permettre à un enfant (cible principale : 3–10 ans, usage réel pour une fille de 5 ans) d'apprendre à lire en français de façon progressive, interactive et ludique, via des activités courtes, un système de progression et des récompenses adaptées aux enfants.

## Contrainte principale
- Application web responsive et accessible depuis le navigateur d'une tablette, d'un téléphone ou d'un ordinateur.
- Interface adaptée aux enfants (taille des cibles tactiles, couleurs, polices lisibles, animation, voix off).
- Respect de la vie privée et des règles applicables aux mineurs (GDPR/consentement parental, pas de tracking externe sans consentement explicite).

## Public cible
- Enfants 3–10 ans.
- Niveau d'apprentissage : débutant (alphabet), premiers sons (phonèmes), syllabes, lecture de mots simples, phrases courtes.
- Parents/tuteurs (compte parental) pour la configuration et le suivi.

## Principes pédagogiques
- Progression graduelle par niveaux et par compétences (lettres, sons, syllabes, mots, phrases).
- Répétition espacée et variations (jeux différents pour la même compétence).
- Feedback immédiat et positif (sons, encouragements, étoiles, autocollants virtuels).
- Sessions courtes (3–10 minutes) et option de jouer plusieurs mini-jeux.

## Mode d'utilisation
- Device : navigateur moderne (Chrome, Edge, Safari, Firefox) sur tablette, mobile ou ordinateur.
- Mode hors-ligne partiel souhaité (PWA) pour recycler quelques leçons téléchargées.
- Utilisation principale par l'enfant ; contrôle parental via une section protégée (code simple, question mathématique, ou image à cliquer pour éviter la manipulation par l'enfant).

## Parcours utilisateur (flux simplifié)
1. Ecran d'accueil : choisir le profil (avatar) ou créer un profil enfant.
2. Écran principal : suggestions d'activités selon le niveau, progression visible, bouton "Jouer".
3. Session de jeu : mini-jeu (30s–3min), feedback, récompense.
4. Fin de session : résumé court (points gagnés, nouvel autocollant), proposition de continuer ou de revenir plus tard.
5. Espace parental : voir progression, ajuster paramètres (temps max, niveau, sons activés), gérer abonnements si présents.

## Fonctionnalités fonctionnelles détaillées

### 1) Gestion des profils
- Créer/modifier/supprimer des profils enfants (nom, âge, avatar, niveau apparenté).
- Un profil parental (ou code parental) pour accéder aux réglages, historique et réglage du temps d'écran.

### 2) Système de progression et niveaux
- Compétences (tags) : Alphabet (lettres), Phonèmes (sons), Syllabes, Mots, Phrases, Compréhension.
- Chaque compétence contient plusieurs leçons et activités.
- Barres de progression et badges pour chaque compétence.
- Algorithme simple de progression : réussite -> niveau suivant, erreurs répétées -> activités supplémentaires de remédiation.

### 3) Mini-jeux pédagogiques (exemples)
- Trouve la lettre : afficher image et choisir la lettre correspondante.
- Sonorité : jouer un phonème et demander d'identifier la lettre ou l'image.
- Assemblage de syllabes : glisser-déposer syllabes pour former un mot.
- Lecture guidée : syllabes surbrillantes, lecture audio phrase par phrase.
- Mémoire/associations : associer image et mot.

Chaque jeu doit avoir plusieurs niveaux de difficulté et paramètres de durée.

### 4) Gamification et récompenses
- Points/étoiles gagnées à chaque activité.
- Système de monnaie virtuelle (ex : étoiles) pour débloquer autocollants, tenues d'avatar, mini-décorations.
- Badges pour jalons (p.ex. "Toutes les lettres reconnues").
- Tableau des récompenses visible et simple.
- Modes de récompense non-addictifs : limites quotidiennes et encouragements à la diversité d'activités.

### 5) Audio et multimédia
- Voix off professionnelle ou synthèse vocale claire pour instructions et lectures.
- Effets sonores positifs (bravo, applaudissements) et animations.
- Possibilité d'activer/désactiver la musique et les effets.

### 6) Accessibilité
- UI adaptée (contraste, grande police optionnelle, icônes claires).
- Navigation simple (grosse cibles tactiles) et compatibilité avec lecteurs d'écran basiques si nécessaire.

### 7) Sécurité & vie privée
- Pas de collecte d'informations personnelles sensibles sans consentement parental.
- Pas de publicité ciblée pour les enfants.
- Option de créer le compte et stocker uniquement l'indispensable : pseudo, niveau, progression.
- Stockage chiffré côté serveur si comptes persistent.

### 8) Parental / Analytics
- Dashboard parental : temps d'utilisation, progression par compétence, activités recommandées.
- Export simple des progrès (PDF ou email résumé hebdomadaire).
- Analytiques anonymisées et agrégées côté produit (opt-in pour amélioration produit).

## Exigences non-fonctionnelles
- Responsive design (mobile/tablette/desktop) ; priorité tablette orientation paysage et portrait.
- Temps de latence bas (<200–400ms pour interactions locales), jeux légers.
- Locale : Français prioritaire, architecture i18n pour ajout d'autres langues.
- Sécurité : HTTPS obligatoire, protections basiques contre injections.
- Compatibilité : navigateurs modernes sur Android/iOS/Windows/Mac.

## Contraintes techniques et recommandations
- Front-end : framework moderne (React, Vue ou Svelte) + TypeScript recommandé.
- Backend : Node.js/Express ou service serverless pour sauvegarde des profils. Peut démarrer sans backend (localStorage) pour MVP.
- Stockage : localStorage / IndexedDB pour progression locale; backend pour profils multi-appareils.
- PWA : ajouter manifest et service worker pour offline partiel.
- Assets audio : formats compressés (OGG/MP3) et lazy-loading.

## MVP (priorités)
- Authentification minimale : profils locaux (localStorage) + code parental simple.
- 5 types de mini-jeux couvrant lettres, sons, syllabes et mots.
- Système de progression et récompenses de base (étoiles, autocollants).
- Dashboard parental simplifié (temps & progression).
- Responsive UI et audio des instructions.

## Critères d'acceptation
- Un enfant de 5 ans peut compléter une activité sans aide extérieure (test utilisateur).
- Progression enregistrée et visible après fermeture/rouverture du navigateur (localStorage ou backend).
- UI lisible et utilisable sur tablette tactile (tests manuels).
- Aucune publicité externe et pas de collecte de données personnelles sans consentement.

## Cas limites et edge cases
- App en offline : pouvoir jouer aux leçons téléchargées et synchroniser ensuite.
- Perte de progression : offrir export/import local des profils.
- Accès non autorisé à la section parentale : mettre gate simple non-trivial pour l'enfant.
- Texte trop petit pour enfant : option "mode enfant" avec plus grand.

## Scénarios de test (exemples)
- Création d'un profil enfant et validation de l'affichage personnalisé.
- Réaliser un mini-jeu et vérifier gain d'étoiles et progression.
- Accéder au dashboard parental et vérifier les données de progression.
- Tester la navigation tactile sur tablette et le rendu responsive.

## Roadmap & prochaines étapes
1. Réaliser le prototype UI (écrans clés) et le tester avec un enfant.
2. Implémenter MVP (front + stockage local) : 2–4 semaines.
3. Ajouter backend pour sauvegarde multi-appareils et PWA : itération suivante.
4. Tests utilisateurs et itération UX.

## Annexes
- Palette de couleurs : utiliser couleurs douces, contraste accentué pour éléments cliquables.
- Police : police sans-serif très lisible (ex : OpenDyslexic optionnelle ou Google Font adaptée aux enfants).
- Exemple d'assets : pack d'icônes, voix-off (échantillons) et pack d'autocollants.

---

Fait pour : usage familial, adaptation aux enfants 3–10 ans, langue française.

Pour toute modification ou ajout (par ex. intégration d'un backend spécifique, support multi-langues), lister les besoins et je mettrai à jour ces spécifications.