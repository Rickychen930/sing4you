import type { Request, Response } from 'express';
import { MediaService } from '../services/MediaService';
import { getRequiredStringParam } from '../utils/requestHelpers';

export class MediaController {
  private mediaService: MediaService;

  constructor() {
    this.mediaService = new MediaService();
  }

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const media = await this.mediaService.getAll();
      res.json({ success: true, data: media });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const media = await this.mediaService.getById(id);
      res.json({ success: true, data: media });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public getByVariationId = async (req: Request, res: Response): Promise<void> => {
    try {
      const variationId = getRequiredStringParam(req, 'variationId');
      const media = await this.mediaService.getByVariationId(variationId);
      res.json({ success: true, data: media });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const media = await this.mediaService.create(req.body);
      res.status(201).json({ success: true, data: media });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      const media = await this.mediaService.update(id, req.body);
      res.json({ success: true, data: media });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getRequiredStringParam(req, 'id');
      await this.mediaService.delete(id);
      res.json({ success: true, message: 'Media deleted successfully' });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ success: false, error: err.message });
    }
  };
}
