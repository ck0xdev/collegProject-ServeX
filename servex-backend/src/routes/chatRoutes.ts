import { Router } from 'express';
import { getChatHistory } from '../controllers/chatController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/:bookingId', verifyToken, getChatHistory);

export default router;