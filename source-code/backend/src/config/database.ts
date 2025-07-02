import { Sequelize } from "sequelize"; // Sequelize ORM (https://sequelize.org/)

import { createModel as createUserModel } from "#models/user.js";
// import { createModel as createTodoModel } from "./Todo.js";


// Defining database informations
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = 'database';
const DB_PORT = '5432';
const DB_DIALECT = 'postgresql'

// Building the connection URL
const DB_URL = `${DB_DIALECT}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

export const database = new Sequelize(DB_URL);

try {
    await database.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database: ', error);
}
    
export const User = createUserModel(database);

/*
createTodoModel(database);

export const {Todo} = database.models;

//associations configuration
User.Todos = User.hasMany(Todo);
Todo.User = Todo.belongsTo(User);
*/

// Synchronize schema (creates missing tables)
database.sync()
    .then( () => {
        console.log("Database synced correctly");
    })
    .catch((err: Error) => {
        console.error("Error with database synchronization: " + err.message);
        throw err; // Raise error
    });