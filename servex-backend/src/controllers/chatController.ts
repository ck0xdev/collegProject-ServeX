import { Response } from 'express';
import { db } from '../firebase';
import { AuthRequest } from '../middleware/authMiddleware';

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Force bookingId to be treated as a string
    const bookingId = req.params.bookingId as string;
    
    // Fetch messages for this booking, ordered by time
    const snapshot = await db.collection('chats')
      .doc(bookingId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get();

    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(messages);
  } catch (error) {
    console.error('Chat History Error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};