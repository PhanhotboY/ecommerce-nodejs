import { IRoleAttrs } from '../interfaces/role.interface';
import {
  createResource,
  getAllResources,
} from '../models/repositories/resource.repo';
import {
  createRole,
  getAllRoles,
  getPermissions,
  getRole,
  getRoleById,
} from '../models/repositories/role.repo';
import { IResourceAttrs } from '../interfaces/resource.interface';
import { getReturnData, getReturnList, getSlug } from '../utils';
import { BadRequestError } from '../core/errors';
import { ROLE } from '../constants';

export const RBACService = {
  async createRole(role: IRoleAttrs) {
    const newRole = await createRole({
      name: role.name,
      description: role.description,
      slug: getSlug(role.name),
      grants: role.grants,
      status: ROLE.STATUS.ACTIVE,
    });

    return getReturnData(newRole);
  },

  async getRoles() {
    const roles = await getAllRoles();

    return getReturnList(roles);
  },

  async getRoleById(roleId: string) {
    const role = await getRoleById(roleId);

    return getReturnData(role);
  },

  async getRoleBySlug(slug: string) {
    const role = await getRole({ slug });
    if (!role) {
      throw new BadRequestError('Role not found');
    }

    return getReturnData(role);
  },

  async getPermissions(role: string) {
    const permissions = await getPermissions({ slug: role });

    return getReturnData(permissions);
  },

  async createResource(resrc: IResourceAttrs) {
    const newResource = await createResource({
      name: resrc.name,
      description: resrc.description,
      slug: getSlug(resrc.name),
    });

    const ret = getReturnData(newResource);
    console.log(ret);

    return ret;
  },

  async getResources() {
    const resources = await getAllResources();

    return getReturnList(resources);
  },
};
