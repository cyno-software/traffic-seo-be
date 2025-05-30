import { Permission, RolePermission } from "../../models/index.model";
import { PermissionAttributes } from "../../interfaces/Permission.interface";
import { Op, WhereOptions } from "sequelize";
import { ErrorType } from "../../types/Error.type";
import statusCode from "../../constants/statusCode";

export const createPermissionRepo = async (
  permissionData: Omit<PermissionAttributes, "id" | "createdAt" | "updatedAt">
): Promise<PermissionAttributes> => {
  try {
    // Check if permission already exists by name (or other unique field)
    const existingPermission = await Permission.findOne({
      where: { name: permissionData.name }, // Adjust 'name' to your unique field
    });

    if (existingPermission) {
      throw new ErrorType(
        "ConflictError", // Error name
        `Permission with name '${permissionData.name}' already exists`, // Message
        undefined, // Optional code (not used here)
        statusCode.CONFLICT // HTTP status code for Conflict
      );
    }

    // Create new permission
    const permission = await Permission.create(permissionData);
    return permission.toJSON() as PermissionAttributes;
  } catch (error) {
    if (error instanceof ErrorType) {
      throw error; // Re-throw ErrorType as-is
    }
    throw new Error(`Error creating permission: ${(error as Error).message}`);
  }
};

export const findPermissionByIdRepo = async (
  id: number
): Promise<PermissionAttributes | null> => {
  try {
    const permission = await Permission.findByPk(id);
    return permission ? (permission.toJSON() as PermissionAttributes) : null;
  } catch (error) {
    throw new Error(
      `Error finding permission by ID: ${(error as Error).message}`
    );
  }
};

export const findAllPermissionsRepo = async (): Promise<
  PermissionAttributes[]
> => {
  try {
    const permissions = await Permission.findAll({
      where: { isDeleted: false },
      order: [["createdAt", "DESC"]],
    });
    return permissions.map(
      (permission) => permission.toJSON() as PermissionAttributes
    );
  } catch (error) {
    throw new Error(
      `Error finding all permissions: ${(error as Error).message}`
    );
  }
};

export const updatePermissionRepo = async (
  id: number,
  permissionData: Partial<
    Omit<PermissionAttributes, "id" | "createdAt" | "updatedAt">
  >
): Promise<PermissionAttributes | null> => {
  try {
    const permission = await Permission.findByPk(id);
    if (!permission) return null;

    await permission.update(permissionData);
    return permission.toJSON() as PermissionAttributes;
  } catch (error) {
    throw new Error(`Error updating permission: ${(error as Error).message}`);
  }
};

export const deletePermissionRepo = async (id: number): Promise<boolean> => {
  try {
    const permission = await Permission.findByPk(id);
    if (!permission) return false;

    await permission.update({ isDeleted: true });
    return true;
  } catch (error) {
    throw new Error(`Error deleting permission: ${(error as Error).message}`);
  }
};

export const searchPermissionRepo = async (
  key: string | undefined,
  page: number,
  limit: number

): Promise<{ permissions: PermissionAttributes[]; total: number }> => {
  try {
    const offset = (page - 1) * limit;

    // Build where clause for search
    const where: WhereOptions<Permission> = {
      isDeleted: false,
    };

    if (key) {
      where.name = {
        [Op.like]: `%${key}%`, // Case-insensitive search
      };
      where.code = {
        [Op.like]: `%${key}%`, // Case-insensitive search
      };
    }

    // Query roles with pagination and search
    const { rows: permissions, count: total } =
      await Permission.findAndCountAll({
        where,
        limit: limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

    return {
      permissions,
      total,
    };
  } catch (error) {
    throw new Error(`Error searching roles: ${(error as Error).message}`);
  }
};


export const getPermissionsByRoleIdRepo = async (roleId: number): Promise<PermissionAttributes[] | null> => {
  try {
    const permissions = await Permission.findAll({
      include: [
        {
          model: RolePermission,
          as: "rolePermissions",
          where: { 
            roleId,
            isDeleted: false // Only include non-deleted role permissions
          },
          attributes: [], // Exclude RolePermission attributes from the result
          required: true, // Inner join to only return permissions with matching roleId
        },
      ],
      where: {
        isDeleted: false, // Only include non-deleted permissions
      },
    });

    return permissions.length > 0 ? permissions : null;
  } catch (error: any) {
    throw new ErrorType(error.name, error.message, error.code);
  }
};