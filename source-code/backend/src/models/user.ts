import { DataTypes, Model, InferAttributes, InferCreationAttributes, Sequelize } from "sequelize"; // Sequelize ORM (https://sequelize.org/)
import bcrypt from "bcrypt"; // bcrypt hashing algorithm (https://www.npmjs.com/package/bcrypt)


interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    username: string;
    password: string;
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
            allowNull: false,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value: string) { // Custom setter method
                // We shouldn't save passwords in plaintext in a database!
                // We are storing a secure hash of the password and using a random salt to protect against rainbow tables
                const saltRounds = 12;
                let hash = bcrypt.hashSync(value, saltRounds);
                this.setDataValue('password', hash);
                // TODO: Switch to async version of bcrypt
            }
        }
    }, { 
        // Other model options go here
        // NOTE: The actual table name is inferred from the model name (pluralized) by default
    });

    return User;
}