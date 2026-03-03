import { Router } from 'express';
import { submitDelivery, getDelivery } from '../controllers/deliveryController';
import { verifyToken } from '../middleware/authMiddleware';
import { verifyAdmin } from '../middleware/adminMiddleware';

const router = Router();

// Admin route
router.post('/submit', verifyToken, verifyAdmin, submitDelivery);

// Customer route
router.get('/access/:bookingId', verifyToken, getDelivery);

export default router;