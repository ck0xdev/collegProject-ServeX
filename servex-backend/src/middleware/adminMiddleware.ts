import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const verifyAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden Admin access required' });
  }
};