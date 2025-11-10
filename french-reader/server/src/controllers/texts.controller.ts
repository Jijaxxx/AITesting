import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const createTextSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  translation: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  tags: z.array(z.string()),
});

const updateProgressSchema = z.object({
  completed: z.boolean().optional(),
  score: z.number().min(0).max(100).optional(),
});

export const getTexts = async (req: Request, res: Response) => {
  try {
    const difficulty = req.query.difficulty as string | undefined;
    const texts = await prisma.text.findMany({
      where: difficulty ? { difficulty: difficulty as any } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return res.json(texts);
  } catch (error) {
    throw error;
  }
};

export const getText = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const text = await prisma.text.findUnique({
      where: { id },
      include: {
        progress: {
          where: { userId: req.user!.id },
          select: { completed: true, score: true, lastRead: true },
        },
      },
    });

    if (!text) {
      return res.status(404).json({ message: 'Text not found' });
    }

    return res.json(text);
  } catch (error) {
    throw error;
  }
};

export const createText = async (req: Request, res: Response) => {
  try {
    const data = createTextSchema.parse(req.body);
    const text = await prisma.text.create({ data });
    return res.status(201).json(text);
  } catch (error) {
    throw error;
  }
};

export const updateProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateProgressSchema.parse(req.body);

    const progress = await prisma.progress.upsert({
      where: {
        userId_textId: {
          userId: req.user!.id,
          textId: id,
        },
      },
      update: {
        ...data,
        lastRead: new Date(),
      },
      create: {
        userId: req.user!.id,
        textId: id,
        ...data,
      },
    });

    return res.json(progress);
  } catch (error) {
    throw error;
  }
};