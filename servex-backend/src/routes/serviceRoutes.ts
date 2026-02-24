import { Router } from 'express';
import { createService, getAllServices } from '../controllers/serviceController';
import { verifyToken } from '../middleware/authMiddleware';
import { verifyAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', getAllServices);

router.post('/', verifyToken, verifyAdmin, createService);

export default router;