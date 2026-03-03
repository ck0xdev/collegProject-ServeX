import { Router } from 'express';
import { submitPayment, verifyPayment } from '../controllers/paymentController';
import { verifyToken } from '../middleware/authMiddleware';
import { verifyAdmin } from '../middleware/adminMiddleware';

const router = Router();

// Customer submits UPI reference number
router.post('/submit', verifyToken, submitPayment);

// Admin verifies the payment
router.patch('/verify/:paymentId', verifyToken, verifyAdmin, verifyPayment);

export default router;