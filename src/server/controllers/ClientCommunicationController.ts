import type { Request, Response, NextFunction } from 'express';
import { ClientCommunicationService } from '../services/ClientCommunicationService';
import { getRequiredStringParam } from '../utils/requestHelpers';
import type { IClientCommunication } from '../../shared/interfaces';

function normalizeCommunicationBody(body: Partial<IClientCommunication> & { sentAt?: string | Date }): Partial<IClientCommunication> {
  const out = { ...body };
  if (out.sentAt != null && typeof out.sentAt === 'string') out.sentAt = new Date(out.sentAt);
  return out;
}

export class ClientCommunicationController {
  private communicationService = new ClientCommunicationService();

  public getByClientId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clientId = getRequiredStringParam(req, 'clientId');
      const list = await this.communicationService.getByClientId(clientId);
      res.json({ success: true, data: list });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const item = await this.communicationService.getById(id);
      if (!item) {
        res.status(404).json({ success: false, error: 'Communication not found' });
        return;
      }
      res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = normalizeCommunicationBody(req.body);
      const item = await this.communicationService.create(body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const item = await this.communicationService.update(id, req.body);
      if (!item) {
        res.status(404).json({ success: false, error: 'Communication not found' });
        return;
      }
      res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const deleted = await this.communicationService.delete(id);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Communication not found' });
        return;
      }
      res.json({ success: true, message: 'Communication deleted' });
    } catch (error) {
      next(error);
    }
  };
}
