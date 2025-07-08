import { Sequelize } from "sequelize"; // Sequelize ORM (https://sequelize.org/)

import { createModel as createUserModel } from "#models/user.js";
import { createModel as createUserRoleModel } from "#models/userRole.js";
import { createModel as createSightingModel } from "#models/sighting.js";
import { createModel as createCommentModel } from "#models/comment.js";


// Defining database informations
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = 'database';
const DB_PORT = '5432';

// Building the connection URL
const POSTGRESQL_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`


// Connect to database
export const database = new Sequelize(POSTGRESQL_URL);

try {
    await database.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database: ', error);
}


// Create models
export const User = createUserModel(database);
export const UserRole = createUserRoleModel(database);
export const Sighting = createSightingModel(database);
export const Comment = createCommentModel(database);


// Associations configuration
// UserRole 1:N User (foreign key in User)
UserRole.hasMany(User, {
    onDelete: 'SET DEFAULT', // What happens when UserRole is deleted
    onUpdate: 'CASCADE', // What happens when UserRole is updated
    foreignKey: {
        allowNull: false,
        defaultValue: "USER"
    }
});
User.belongsTo(UserRole);

// User 1:N Sighting (foreign key in Sighting)
User.hasMany(Sighting, {
    onDelete: 'RESTRICT', // What happens when User is deleted
    onUpdate: 'CASCADE', // What happens when User is updated
    foreignKey: {
        allowNull: false
    }
});
Sighting.belongsTo(User);

// User 1:N Comment (foreign key in Comment)
User.hasMany(Comment, {
    onDelete: 'CASCADE', // What happens when User is deleted
    onUpdate: 'CASCADE', // What happens when User is updated
    foreignKey: {
        allowNull: false,
    }
});
Comment.belongsTo(User);

// Sighting 1:N Comment (foreign key in Comment)
Sighting.hasMany(Comment, {
    onDelete: 'CASCADE', // What happens when Sighting is deleted
    onUpdate: 'CASCADE', // What happens when Sighting is updated
    foreignKey: {
        allowNull: false,
    }
});
Comment.belongsTo(Sighting);


// Synchronize schema (creates missing tables)
database.sync()
    .then( () => {
        console.log("Database synced correctly");
    })
    .catch((err: Error) => {
        console.error("Error with database synchronization: " + err.message);
        throw err; // Raise error
    });