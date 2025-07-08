import { DataTypes, Model, InferAttributes, InferCreationAttributes, Sequelize, CreationOptional } from "sequelize"; // Sequelize ORM (https://sequelize.org/)


interface SightingModel extends Model<InferAttributes<SightingModel>, InferCreationAttributes<SightingModel>> {
    id: CreationOptional<number>;
    photoUrl: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
}

/**
 * Defines the Sighting model
 * @param database The database object returned by the ORM connection
 */
export function createModel(database: Sequelize) {
    
    const Sighting = database.define<SightingModel>('Sighting', {
        
        // Define the model attributes
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        photoUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        latitude: {
            type: DataTypes.DECIMAL(8,6),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(9,6),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
        }

        // By default, Sequelize adds the createdAt and updatedAt fields to all models
    }, { 
        // Other model options go here
        // NOTE: The actual table name is inferred from the model name (pluralized) by default
    });

    return Sighting;
}