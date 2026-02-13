import { DataTypes, Model, InferAttributes, InferCreationAttributes, Sequelize, CreationOptional } from "sequelize"; // Sequelize ORM (https://sequelize.org/)


interface UserRoleModel extends Model<InferAttributes<UserRoleModel>, InferCreationAttributes<UserRoleModel>> {
    rolename: string;
}

/**
 * Defines the UserRole model
 * @param database The database object returned by the ORM connection
 */
export function createModel(database: Sequelize) {
    
    const UserRole = database.define<UserRoleModel>('UserRole', {
        
        // Define the model attributes
        rolename: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                notEmpty: true,
                isUppercase: true
            }
        }
        
        // By default, Sequelize adds the createdAt and updatedAt fields to all models
    }, { 
        // Other model options go here
        // NOTE: The actual table name is inferred from the model name (pluralized) by default
    });

    // Hook: Populates default roles after model sync
    UserRole.afterSync(async () => {
        const defaultUserRoles = [ 
            { 
                rolename: 'ADMIN'
            },
            { 
                rolename: 'USER',
            }
        ];

        // If table doesn't have roles, create them
        if ((await UserRole.count()) === 0) {
            for (const role of defaultUserRoles) {
                await UserRole.create(role);
            }
        }
    });

    return UserRole;
}