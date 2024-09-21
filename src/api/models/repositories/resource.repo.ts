import { IResourceAttrs } from '../../interfaces/resource.interface';
import { ResourceModel } from '../resource.model';
import { RoleModel } from '../role.model';

const getAllResources = async () => {
  return await ResourceModel.find();
};

const createResource = async (resource: IResourceAttrs) => {
  return await ResourceModel.build(resource);
};

export { getAllResources, createResource };
