import { Router } from 'express';
import { getRewardsByProfile, updateRewards } from '../controllers/rewardController.js';

const router = Router();

router.get('/:profileId', getRewardsByProfile);
router.post('/:profileId', updateRewards);

export default router;
