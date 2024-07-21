import { RESOURCE } from '../../constants';
import { IRoleAttrs } from '../../interfaces/role.interface';
import { RoleModel } from '../role.model';

const getAllRoles = async () => {
  return await RoleModel.find();
};

const getRoleById = async (roleId: string) => {
  return await RoleModel.findById(roleId);
};

const getRole = async ({ name, slug }: { name?: string; slug?: string }) => {
  return await RoleModel.findOne({
    $or: [{ name }, { slug }],
  }).populate('rol_grants.resource', 'src_name src_slug -_id');
};

const getPermissions = async ({
  name,
  slug,
}: {
  name?: string;
  slug?: string;
}) => {
  return await RoleModel.aggregate([
    {
      $match: { $or: [{ rol_name: name }, { rol_slug: slug }] },
    },
    {
      $unwind: '$rol_grants',
    },
    {
      $lookup: {
        from: RESOURCE.COLLECTION_NAME,
        localField: 'rol_grants.resource',
        foreignField: '_id',
        as: 'resource',
      },
    },
    {
      $unwind: '$resource',
    },
    {
      $project: {
        role: '$rol_name',
        resource: '$resource.src_name',
        action: '$rol_grants.action',
        attributes: '$rol_grants.attributes',
        _id: 0,
      },
    },
    {
      $unwind: '$action',
    },
  ]);
};

const createRole = async (role: IRoleAttrs) => {
  return await RoleModel.build(role);
};

export { getAllRoles, createRole, getRoleById, getRole, getPermissions };
