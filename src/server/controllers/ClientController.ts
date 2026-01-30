import type { Request, Response, NextFunction } from 'express';
import { ClientService } from '../services/ClientService';
import { getRequiredStringParam } from '../utils/requestHelpers';

export class ClientController {
  private clientService = new ClientService();

  public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clients = await this.clientService.getAll();
      res.json({ success: true, data: clients });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const client = await this.clientService.getById(id);
      if (!client) {
        res.status(404).json({ success: false, error: 'Client not found' });
        return;
      }
      res.json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = await this.clientService.create(req.body);
      res.status(201).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const client = await this.clientService.update(id, req.body);
      if (!client) {
        res.status(404).json({ success: false, error: 'Client not found' });
        return;
      }
      res.json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const deleted = await this.clientService.delete(id);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Client not found' });
        return;
      }
      res.json({ success: true, message: 'Client deleted' });
    } catch (error) {
      next(error);
    }
  };
}
