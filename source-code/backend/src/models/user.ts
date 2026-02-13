import { DataTypes, Model, InferAttributes, InferCreationAttributes, Sequelize, CreationOptional } from "sequelize"; // Sequelize ORM (https://sequelize.org/)
import bcrypt from "bcrypt"; // bcrypt hashing algorithm (https://www.npmjs.com/package/bcrypt)


interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    username: string;
    email: string;
    password: string;
    rolename: CreationOptional<string>;
}

/**
 * Defines the User model
 * @param database The database object returned by the ORM connection
 */
export function createModel(database: Sequelize) {
    
    const User = database.define<UserModel>('User', {
        
        // Define the model attributes
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        rolename: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'fk_rolename',
            defaultValue: "USER",
            validate: {
                notEmpty: true,
                isUppercase: true
            }
        }
        
        // By default, Sequelize adds the createdAt and updatedAt fields to all models
    }, { 
        // Other model options go here
        // NOTE: The actual table name is inferred from the model name (pluralized) by default
        underscored: true
    });

    // We shouldn't save passwords in plaintext in a database!
    // Hook: Before create and update, hashes the password using a random salt to protect against rainbow tables. Then stores it
    User.beforeSave(async (user) => {
        if (user.changed('password')) {
            const saltRounds = 12;
            const hash = await bcrypt.hash(user.password, saltRounds);
            user.setDataValue('password', hash);
        }
    });

    User.prototype.toJSON = function () {
        const values = { ...this.get({ plain: true }) };

        // Delete foreign key field to avoid confusion
        delete values.fk_rolename;

        return values;
    };

    return User;
}