import slugify from 'slugify';

import { IRoleAttrs } from '../interfaces/role.interface';
import {
  createResource,
  getAllResources,
} from '../models/repositories/resource.repo';
import { createRole, getAllRoles } from '../models/repositories/role.repo';
import { IResourceAttrs } from '../interfaces/resource.interface';
import { getReturnData, getReturnList } from '../utils';

export const RBACService = {
  async createRole(role: IRoleAttrs) {
    const newRole = await createRole({
      name: role.name,
      description: role.description,
      slug: slugify(role.name, { lower: true }),
      grants: role.grants,
    });

    return getReturnData(newRole);
  },

  async getRoles() {
    const roles = await getAllRoles();

    return getReturnList(roles);
  },

  async createResource(resrc: IResourceAttrs) {
    const newResource = await createResource({
      name: resrc.name,
      description: resrc.description,
      slug: slugify(resrc.name, { lower: true }),
    });

    return getReturnData(newResource);
  },

  async getResources() {
    const resources = await getAllResources();

    return getReturnList(resources);
  },
};
