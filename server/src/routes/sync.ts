import { Router } from 'express';
import { syncOfflineQueue } from '../controllers/syncController.js';

const router = Router();

router.post('/', syncOfflineQueue);

export default router;
