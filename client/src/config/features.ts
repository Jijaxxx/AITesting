/**
 * Feature flags pour l'application
 * Permet d'activer/désactiver des fonctionnalités en fonction de l'environnement
 */

export const FEATURES = {
  /**
   * Active les Reading Games (nouveaux jeux de lecture)
   * Phase 1: MagicSound fonctionnel
   * Phase 2-3: Autres jeux en développement
   */
  READING_GAMES_ENABLED: true,

  /**
   * Active les métriques et analytics
   */
  ANALYTICS_ENABLED: false,

  /**
   * Active le mode debug avec logs supplémentaires
   */
  DEBUG_MODE: true,
} as const;

/**
 * Vérifie si une feature est activée
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature] === true;
}
