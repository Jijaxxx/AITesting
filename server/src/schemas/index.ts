import { z } from 'zod';

// Paramètres d'accessibilité
export const settingsSchema = z.object({
  fontSize: z.enum(['normal', 'large']).default('normal'),
  contrast: z.enum(['normal', 'high']).default('normal'),
  motionReduced: z.boolean().default(false),
  sessionDuration: z.number().int().min(5).max(30).default(15),
});

// Profil
export const createProfileSchema = z.object({
  pseudo: z
    .string()
    .min(2, 'Le pseudo doit contenir au moins 2 caractères')
    .max(40, 'Le pseudo ne peut pas dépasser 40 caractères')
    .trim(),
  age: z.number().int().min(3).max(8),
  avatarKey: z.string().max(40).default('avatar_001'),
  settings: settingsSchema.optional(),
});

export const updateProfileSchema = z.object({
  pseudo: z.string().min(2).max(40).trim().optional(),
  age: z.number().int().min(3).max(8).optional(),
  avatarKey: z.string().max(40).optional(),
  settings: settingsSchema.optional(),
});

// Progression
export const createProgressSchema = z.object({
  profileId: z.string().cuid(),
  world: z.number().int().min(1).max(3),
  level: z.number().int().min(1).max(4),
  stars: z.number().int().min(0).max(3).default(0),
  xp: z.number().int().min(0).default(0),
  attemptsCount: z.number().int().min(0).default(0),
});

export const updateProgressSchema = z.object({
  stars: z.number().int().min(0).max(3).optional(),
  xp: z.number().int().min(0).optional(),
  attemptsCount: z.number().int().min(0).optional(),
});

// Erreurs (statistiques)
export const createErrorStatSchema = z.object({
  profileId: z.string().cuid(),
  skillKey: z.string().max(40),
  count: z.number().int().min(0).default(1),
});

// Récompenses
export const updateRewardSchema = z.object({
  badges: z.array(z.string()).max(6).optional(),
  stickers: z.array(z.string()).max(12).optional(),
});

// Synchronisation (offline → online)
export const syncQueueSchema = z.object({
  operations: z.array(
    z.object({
      type: z.enum(['progress', 'error', 'reward']),
      data: z.record(z.any()),
      timestamp: z.string().datetime(),
    })
  ),
});
