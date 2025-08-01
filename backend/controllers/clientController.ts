import { Request, Response } from 'express';
import { ClientService } from '../services/clientService';

const clientService = new ClientService();

export const getClients = async (req: Request, res: Response) => {
  try {
    await clientService.initializeClients(); // Ensure clients exist
    const clients = await clientService.getAllClients();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};