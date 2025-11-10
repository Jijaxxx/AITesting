import { Router } from 'express';
import { getTexts, getText, createText, updateProgress } from '../controllers/texts.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getTexts);
router.get('/:id', auth, getText);
router.post('/', auth, createText);
router.patch('/:id/progress', auth, updateProgress);

export default router;