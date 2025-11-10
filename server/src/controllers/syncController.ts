import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { syncQueueSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

/**
 * POST /api/sync
 * Synchronise les opérations offline → online
 * Reçoit une queue d'opérations (progress, errors, rewards)
 */
export const syncOfflineQueue = async (req: Request, res: Response) => {
  const { operations } = syncQueueSchema.parse(req.body);

  const results = [];

  for (const op of operations) {
    try {
      if (op.type === 'progress') {
        const { profileId, world, level, stars, xp } = op.data;
        const progress = await prisma.progress.upsert({
          where: {
            profileId_world_level: { profileId, world, level },
          },
          create: { profileId, world, level, stars, xp, attemptsCount: 1 },
          update: {
            stars: Math.max(stars, 0),
            xp: { increment: xp },
            attemptsCount: { increment: 1 },
            lastPlayedAt: new Date(op.timestamp),
          },
        });
        results.push({ type: 'progress', status: 'ok', id: progress.id });
      }

      if (op.type === 'error') {
        const { profileId, skillKey, count } = op.data;
        const errorStat = await prisma.errorStat.upsert({
          where: {
            profileId_skillKey: { profileId, skillKey },
          },
          create: { profileId, skillKey, count },
          update: { count: { increment: count } },
        });
        results.push({ type: 'error', status: 'ok', id: errorStat.id });
      }

      if (op.type === 'reward') {
        const { profileId, badges, stickers } = op.data;
        const reward = await prisma.reward.update({
          where: { profileId },
          data: {
            badges: badges || undefined,
            stickers: stickers || undefined,
          },
        });
        results.push({ type: 'reward', status: 'ok', id: reward.id });
      }
    } catch (error) {
      results.push({ type: op.type, status: 'error', message: (error as Error).message });
    }
  }

  res.json({ synced: results });
};
