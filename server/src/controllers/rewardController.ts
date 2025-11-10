import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { updateRewardSchema } from '../schemas/index.js';
import { AppError } from '../middleware/errorHandler.js';

const prisma = new PrismaClient();

/**
 * GET /api/rewards/:profileId
 * Récupère les récompenses d'un profil
 */
export const getRewardsByProfile = async (req: Request, res: Response) => {
  const { profileId } = req.params;

  const reward = await prisma.reward.findUnique({
    where: { profileId },
  });

  if (!reward) {
    throw new AppError('Récompenses introuvables', 404);
  }

  res.json(reward);
};

/**
 * POST /api/rewards/:profileId
 * Met à jour les récompenses (badges, stickers)
 */
export const updateRewards = async (req: Request, res: Response) => {
  const { profileId } = req.params;
  const data = updateRewardSchema.parse(req.body);

  const reward = await prisma.reward.update({
    where: { profileId },
    data,
  });

  res.json(reward);
};
