import { Router } from 'express';
import { syncUser } from '../controllers/userController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/sync', verifyToken, syncUser);

export default router;