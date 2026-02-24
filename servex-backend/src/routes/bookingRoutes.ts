import { Router } from 'express';
import { createBooking, getMyBookings, getAllBookings } from '../controllers/bookingController';
import { verifyToken } from '../middleware/authMiddleware';
import { verifyAdmin } from '../middleware/adminMiddleware';

const router = Router();

// Customer Routes (Requires login)
router.post('/', verifyToken, createBooking);
router.get('/my-bookings', verifyToken, getMyBookings);

// Admin Routes (Requires login AND Admin role)
router.get('/all', verifyToken, verifyAdmin, getAllBookings);

export default router;