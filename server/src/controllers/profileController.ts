import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createProfileSchema, updateProfileSchema } from '../schemas/index.js';
import { AppError } from '../middleware/errorHandler.js';

const prisma = new PrismaClient();

/**
 * GET /api/profiles
 * Récupère tous les profils (max 4)
 */
export const getAllProfiles = async (_req: Request, res: Response) => {
  const profiles = await prisma.profile.findMany({
    take: 4,
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      pseudo: true,
      age: true,
      avatarKey: true,
      settings: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.json(profiles);
};

/**
 * GET /api/profiles/:id
 * Récupère un profil par ID
 */
export const getProfileById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      progress: { orderBy: [{ world: 'asc' }, { level: 'asc' }] },
      errors: { orderBy: { count: 'desc' } },
      rewards: true,
    },
  });

  if (!profile) {
    throw new AppError('Profil introuvable', 404);
  }

  res.json(profile);
};

/**
 * POST /api/profiles
 * Crée un nouveau profil
 */
export const createProfile = async (req: Request, res: Response) => {
  // Vérifier la limite de 4 profils
  const count = await prisma.profile.count();
  if (count >= 4) {
    throw new AppError('Limite de 4 profils atteinte', 403);
  }

  const data = createProfileSchema.parse(req.body);

  const profile = await prisma.profile.create({
    data: {
      ...data,
      settings: data.settings || {
        font: 'default',
        contrast: false,
        reduceMotion: false,
        sessionMinutes: 15,
      },
      rewards: { create: { badges: [], stickers: [] } },
    },
    include: { rewards: true },
  });

  res.status(201).json(profile);
};

/**
 * PATCH /api/profiles/:id
 * Met à jour un profil existant
 */
export const updateProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updateProfileSchema.parse(req.body);

  const profile = await prisma.profile.update({
    where: { id },
    data,
  });

  res.json(profile);
};

/**
 * DELETE /api/profiles/:id
 * Supprime un profil (cascade: progress, errorStats, reward)
 */
export const deleteProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.profile.delete({ where: { id } });

  res.status(204).send();
};
