import { Router } from 'express';
import { exportProfile, importProfile } from '../controllers/exportController.js';

const router = Router();

router.get('/:profileId', exportProfile);
router.post('/', importProfile);

export default router;
