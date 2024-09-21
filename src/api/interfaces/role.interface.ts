import { HydratedDocument, Model } from 'mongoose';
import { ROLE } from '../constants';

interface IGrant {
  resource: string;
  action: string[];
  attributes: string;
}

export interface IRawRole {
  rol_name: string;
  rol_slug: string;
  rol_status: Values<typeof ROLE.STATUS>;
  rol_description: string;
  rol_grants: IGrant[];
}

export type IRole = HydratedDocument<IRawRole>;

export interface IRoleAttrs {
  name: string;
  slug?: string;
  status?: IRole['rol_status'];
  description: string;
  grants: IGrant[];
}

export interface IRoleModel extends Model<IRole> {
  build(attrs: IRoleAttrs): Promise<IRole>;
}
