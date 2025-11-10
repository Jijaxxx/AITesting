import { Router } from 'express';
import {
  getProgressByProfile,
  upsertProgress,
  updateProgress,
} from '../controllers/progressController.js';

const router = Router();

router.get('/', getProgressByProfile);
router.post('/', upsertProgress);
router.patch('/:id', updateProgress);

export default router;
