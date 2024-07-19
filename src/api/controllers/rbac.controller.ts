import { Request, Response, NextFunction } from 'express';
import { RBACService } from '../services/rbac.service';
import { OK } from '../core/success.response';

export class RBACController {
  static async getResources(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Resources fetched successfully',
      metadata: await RBACService.getResources(),
    });
  }

  static async createResource(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Resource created successfully',
      metadata: await RBACService.createResource(req.body),
    });
  }

  static async getRoles(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Roles fetched successfully',
      metadata: await RBACService.getRoles(),
    });
  }

  static async createRole(req: Request, res: Response, next: NextFunction) {
    return OK({
      res,
      message: 'Role created successfully',
      metadata: await RBACService.createRole(req.body),
    });
  }
}
