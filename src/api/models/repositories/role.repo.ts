import { IRoleAttrs } from '../../interfaces/role.interface';
import { RoleModel } from '../role.model';

const getAllRoles = async () => {
  return await RoleModel.find();
};

const createRole = async (role: IRoleAttrs) => {
  return await RoleModel.build(role);
};

export { getAllRoles, createRole };
