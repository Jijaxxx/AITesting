import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler.js';

const prisma = new PrismaClient();

/**
 * GET /api/export/:profileId
 * Export complet d'un profil (JSON)
 */
export const exportProfile = async (req: Request, res: Response) => {
  const { profileId } = req.params;

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      progress: true,
      errorStats: true,
      reward: true,
    },
  });

  if (!profile) {
    throw new AppError('Profil introuvable', 404);
  }

  res.json({
    version: '1.0',
    exportedAt: new Date().toISOString(),
    profile,
  });
};

/**
 * POST /api/import
 * Import d'un profil complet (restauration)
 */
export const importProfile = async (req: Request, res: Response) => {
  const { profile } = req.body;

  if (!profile || !profile.id) {
    throw new AppError('Données d\'import invalides', 400);
  }

  // Vérifier si le profil existe déjà
  const existing = await prisma.profile.findUnique({ where: { id: profile.id } });
  if (existing) {
    throw new AppError('Ce profil existe déjà', 409);
  }

  // Créer le profil avec toutes ses relations
  const imported = await prisma.profile.create({
    data: {
      id: profile.id,
      pseudo: profile.pseudo,
      age: profile.age,
      avatarKey: profile.avatarKey,
      settings: profile.settings,
      progress: {
        create: profile.progress || [],
      },
      errorStats: {
        create: profile.errorStats || [],
      },
      reward: {
        create: profile.reward || { badges: [], stickers: [] },
      },
    },
    include: {
      progress: true,
      errorStats: true,
      reward: true,
    },
  });

  res.status(201).json(imported);
};
