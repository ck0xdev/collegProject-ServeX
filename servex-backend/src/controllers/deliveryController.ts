import { Response } from 'express';
import { db } from '../firebase';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Admin submits the final project link
export const submitDelivery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, deliveryLink, notes } = req.body;

    await db.collection('bookings').doc(bookingId).update({
      deliveryLink,
      deliveryNotes: notes || '',
      deliveryStatus: 'delivered',
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({ message: 'Delivery submitted successfully' });
  } catch (error) {
    console.error('Delivery submission error:', error);
    res.status(500).json({ error: 'Failed to submit delivery' });
  }
};

// 2. Customer attempts to access the delivery (LOCKED BEHIND PAYMENT)
export const getDelivery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.bookingId as string;
    const customerId = req.user.uid;

    const bookingDoc = await db.collection('bookings').doc(bookingId).get();

    if (!bookingDoc.exists) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    const bookingData = bookingDoc.data();

    // Security Check 1: Is this actually the customer's booking?
    if (bookingData?.customerId !== customerId) {
      res.status(403).json({ error: 'Unauthorized access to this booking' });
      return;
    }

    // Security Check 2: Has the payment been verified by the Admin?
    const paymentSnapshot = await db.collection('payments')
      .where('bookingId', '==', bookingId)
      .where('status', '==', 'verified')
      .get();

    if (paymentSnapshot.empty) {
      res.status(403).json({ 
        error: 'Payment not verified', 
        message: 'Your files are locked until payment is verified by the Admin.' 
      });
      return;
    }

    // If both checks pass, release the project files!
    res.status(200).json({
      deliveryLink: bookingData?.deliveryLink,
      deliveryNotes: bookingData?.deliveryNotes,
      deliveryStatus: bookingData?.deliveryStatus
    });

  } catch (error) {
    console.error('Delivery access error:', error);
    res.status(500).json({ error: 'Failed to fetch delivery' });
  }
};