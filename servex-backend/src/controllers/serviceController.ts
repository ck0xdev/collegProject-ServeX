import { Request, Response } from 'express';
import { db } from '../firebase';

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, basePrice, category, estimatedDays, features } = req.body;

    const newService = {
      name,
      description,
      basePrice,
      category,
      estimatedDays,
      features: features || [],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const serviceRef = await db.collection('services').add(newService);

    res.status(201).json({ id: serviceRef.id, ...newService });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
};

export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('services').where('isActive', '==', true).get();
    const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};