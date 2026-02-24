import { Response } from 'express';
import { db } from '../firebase';
import { AuthRequest } from '../middleware/authMiddleware';

export const syncUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { uid, email, name, picture } = req.user;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const newUser = {
        name: name || '',
        email: email || '',
        phone: '',
        role: 'customer',
        isVerified: false,
        profilePic: picture || '',
        createdAt: new Date().toISOString()
      };

      await userRef.set(newUser);
      res.status(201).json({ message: 'User created', user: newUser });
      return;
    }

    res.status(200).json({ message: 'User exists', user: userDoc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};