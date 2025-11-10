import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createProgressSchema, updateProgressSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

/**
 * GET /api/progress?profileId=xxx
 * Récupère toute la progression d'un profil
 */
export const getProgressByProfile = async (req: Request, res: Response) => {
  const { profileId } = req.query;

  if (!profileId || typeof profileId !== 'string') {
    return res.status(400).json({ error: 'profileId requis' });
  }

  const progress = await prisma.progress.findMany({
    where: { profileId },
    orderBy: [{ world: 'asc' }, { level: 'asc' }],
  });

  res.json(progress);
};

/**
 * POST /api/progress
 * Crée ou met à jour une entrée de progression (upsert)
 */
export const upsertProgress = async (req: Request, res: Response) => {
  const data = createProgressSchema.parse(req.body);

  const progress = await prisma.progress.upsert({
    where: {
      profileId_world_level: {
        profileId: data.profileId,
        world: data.world,
        level: data.level,
      },
    },
    create: data,
    update: {
      stars: data.stars,
      xp: data.xp,
      attemptsCount: { increment: 1 },
      lastPlayedAt: new Date(),
    },
  });

  res.json(progress);
};

/**
 * PATCH /api/progress/:id
 * Met à jour une progression existante
 */
export const updateProgress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updateProgressSchema.parse(req.body);

  const progress = await prisma.progress.update({
    where: { id },
    data: {
      ...data,
      lastPlayedAt: new Date(),
    },
  });

  res.json(progress);
};
