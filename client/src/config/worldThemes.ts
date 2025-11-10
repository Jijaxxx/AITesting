// Configuration des thèmes visuels pour chaque monde
export interface WorldTheme {
  name: string;
  emoji: string;
  color: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
  description: string;
  characters: string[];
  gradient: string;
}

export const WORLD_THEMES: Record<number, WorldTheme> = {
  1: {
    name: 'Monde des Licornes',
    emoji: '🦄',
    color: 'from-pink-100 to-purple-100',
    borderColor: 'border-pink-300',
    textColor: 'text-pink-700',
    bgColor: 'bg-pink-50',
    gradient: 'bg-gradient-to-r from-pink-400 to-purple-400',
    description: 'Rejoins les licornes magiques !',
    characters: ['🦄', '🌈', '⭐', '✨'],
  },
  2: {
    name: 'Monde de Peppa Pig',
    emoji: '🐷',
    color: 'from-red-100 to-orange-100',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    gradient: 'bg-gradient-to-r from-red-400 to-orange-400',
    description: 'Amuse-toi avec Peppa et George !',
    characters: ['🐷', '🐘', '🦒', '🐑'],
  },
  3: {
    name: 'Monde de la Pat\' Patrouille',
    emoji: '🐕',
    color: 'from-blue-100 to-cyan-100',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    gradient: 'bg-gradient-to-r from-blue-400 to-cyan-400',
    description: 'Pars en mission avec les chiots !',
    characters: ['🐕', '🚁', '🚒', '⚡'],
  },
};

// Helper pour obtenir le thème d'un monde
export const getWorldTheme = (worldNumber: number): WorldTheme => {
  return WORLD_THEMES[worldNumber] || WORLD_THEMES[1];
};
