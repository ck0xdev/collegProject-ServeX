import { Response } from 'express';
import { db } from '../firebase';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Customer creates a new booking
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user.uid;
    const { serviceId, requirements, budget, timeline } = req.body;

    const newBooking = {
      customerId,
      serviceId,
      status: 'pending', 
      requirements: requirements || '',
      budget: budget || 0,
      timeline: timeline || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const bookingRef = await db.collection('bookings').add(newBooking);
    res.status(201).json({ id: bookingRef.id, ...newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// 2. Customer fetches their own bookings
export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user.uid;
    const snapshot = await db.collection('bookings').where('customerId', '==', customerId).get();
    
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch your bookings' });
  }
};

// 3. Admin fetches all bookings across the platform
export const getAllBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('bookings').orderBy('createdAt', 'desc').get();
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ error: 'Failed to fetch platform bookings' });
  }
};