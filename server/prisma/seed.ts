import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Compétences (voyelles + digrammes)
const skills = [
  { key: 'a', type: 'vowel', samples: ['avion', 'ananas', 'arbre', 'âne'] },
  { key: 'e', type: 'vowel', samples: ['éléphant', 'épée', 'étoile'] },
  { key: 'i', type: 'vowel', samples: ['igloo', 'île', 'indienne'] },
  { key: 'o', type: 'vowel', samples: ['orange', 'ours', 'olive'] },
  { key: 'u', type: 'vowel', samples: ['usine', 'uniforme', 'unique'] },
  { key: 'ch', type: 'digraph', samples: ['chat', 'chien', 'chaussure', 'chocolat'] },
  { key: 'on', type: 'digraph', samples: ['ballon', 'lion', 'maison', 'savon'] },
  { key: 'ou', type: 'digraph', samples: ['loup', 'poule', 'jouer', 'mouton'] },
  { key: 'an', type: 'digraph', samples: ['orange', 'manger', 'blanc', 'chanter'] },
  { key: 'in', type: 'digraph', samples: ['lapin', 'jardin', 'pain', 'main'] },
];

// 12 niveaux (3 mondes × 4 niveaux)
const levels = [
  // Monde 1 : Voyelles
  { world: 1, index: 1, game: 'loto_sons', skills: ['a', 'e', 'i'] },
  { world: 1, index: 2, game: 'peche_lettres', skills: ['a', 'e', 'i', 'o'] },
  { world: 1, index: 3, game: 'course_syllabes', skills: ['a', 'e', 'i', 'o', 'u'] },
  { world: 1, index: 4, game: 'dictee_karaoke', skills: ['a', 'e', 'i', 'o', 'u'] },

  // Monde 2 : Digrammes simples
  { world: 2, index: 1, game: 'loto_sons', skills: ['ch', 'ou'] },
  { world: 2, index: 2, game: 'peche_lettres', skills: ['ch', 'ou', 'on'] },
  { world: 2, index: 3, game: 'course_syllabes', skills: ['ch', 'ou', 'on'] },
  { world: 2, index: 4, game: 'dictee_karaoke', skills: ['ch', 'ou', 'on'] },

  // Monde 3 : Digrammes complexes
  { world: 3, index: 1, game: 'loto_sons', skills: ['an', 'in'] },
  { world: 3, index: 2, game: 'peche_lettres', skills: ['an', 'in', 'on'] },
  { world: 3, index: 3, game: 'course_syllabes', skills: ['an', 'in', 'ch', 'ou'] },
  { world: 3, index: 4, game: 'dictee_karaoke', skills: ['a', 'e', 'i', 'o', 'u', 'ch', 'ou', 'on', 'an', 'in'] },
];

// 60 mots CE1 mappés par compétence
const vocabulary = [
  // Voyelles
  { word: 'avion', skills: ['a'] },
  { word: 'arbre', skills: ['a'] },
  { word: 'âne', skills: ['a'] },
  { word: 'ami', skills: ['a'] },
  { word: 'école', skills: ['e'] },
  { word: 'étoile', skills: ['e'] },
  { word: 'été', skills: ['e'] },
  { word: 'île', skills: ['i'] },
  { word: 'image', skills: ['i'] },
  { word: 'igloo', skills: ['i'] },
  { word: 'orange', skills: ['o'] },
  { word: 'ours', skills: ['o'] },
  { word: 'olive', skills: ['o'] },
  { word: 'usine', skills: ['u'] },
  { word: 'unique', skills: ['u'] },
  
  // ch
  { word: 'chat', skills: ['ch', 'a'] },
  { word: 'chien', skills: ['ch', 'i', 'e'] },
  { word: 'chocolat', skills: ['ch', 'o', 'a'] },
  { word: 'chaussure', skills: ['ch', 'o', 'u'] },
  { word: 'chameau', skills: ['ch', 'a', 'o'] },
  { word: 'cheval', skills: ['ch', 'e', 'a'] },
  
  // ou
  { word: 'loup', skills: ['ou'] },
  { word: 'poule', skills: ['ou', 'e'] },
  { word: 'mouton', skills: ['ou', 'o'] },
  { word: 'jouer', skills: ['ou', 'e'] },
  { word: 'coucou', skills: ['ou', 'o', 'u'] },
  { word: 'souris', skills: ['ou', 'i'] },
  
  // on
  { word: 'ballon', skills: ['on', 'a'] },
  { word: 'lion', skills: ['on', 'i'] },
  { word: 'maison', skills: ['on', 'a', 'i'] },
  { word: 'savon', skills: ['on', 'a'] },
  { word: 'bonbon', skills: ['on', 'o'] },
  { word: 'melon', skills: ['on', 'e'] },
  
  // an
  { word: 'orange', skills: ['an', 'o', 'e'] },
  { word: 'manger', skills: ['an', 'e'] },
  { word: 'blanc', skills: ['an'] },
  { word: 'chanter', skills: ['an', 'ch', 'e'] },
  { word: 'danser', skills: ['an', 'e'] },
  { word: 'banane', skills: ['an', 'a', 'e'] },
  
  // in
  { word: 'lapin', skills: ['in', 'a'] },
  { word: 'jardin', skills: ['in', 'a'] },
  { word: 'pain', skills: ['in', 'a'] },
  { word: 'main', skills: ['in', 'a'] },
  { word: 'matin', skills: ['in', 'a'] },
  { word: 'sapin', skills: ['in', 'a'] },
  
  // Mots composés
  { word: 'maison', skills: ['a', 'i', 'on'] },
  { word: 'moulin', skills: ['ou', 'in'] },
  { word: 'chanson', skills: ['ch', 'an', 'on'] },
  { word: 'manchon', skills: ['an', 'ch', 'on'] },
  { word: 'pinceau', skills: ['in', 'o'] },
  { word: 'oursin', skills: ['ou', 'in'] },
  { word: 'chaton', skills: ['ch', 'a', 'on'] },
  { word: 'dindon', skills: ['in', 'on'] },
  { word: 'mouton', skills: ['ou', 'on'] },
  { word: 'pantin', skills: ['an', 'in'] },
  { word: 'manchot', skills: ['an', 'ch', 'o'] },
  { word: 'poulain', skills: ['ou', 'in', 'a'] },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Nettoyer les données existantes (ordre important pour les contraintes FK)
  await prisma.progress.deleteMany();
  await prisma.errorStat.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.levelDef.deleteMany();
  await prisma.skill.deleteMany();

  // Insérer les compétences
  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }
  console.log(`✅ ${skills.length} compétences créées`);

  // Insérer les 12 niveaux
  for (const level of levels) {
    await prisma.levelDef.create({ data: level });
  }
  console.log(`✅ ${levels.length} niveaux créés`);

  console.log(`📖 ${vocabulary.length} mots de vocabulaire disponibles (non stockés en DB, utilisés par les jeux)`);

  console.log('🎉 Seed terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
