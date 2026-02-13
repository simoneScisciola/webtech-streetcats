import { DataTypes, Model, InferAttributes, InferCreationAttributes, Sequelize, CreationOptional } from "sequelize"; // Sequelize ORM (https://sequelize.org/)


interface SightingModel extends Model<InferAttributes<SightingModel>, InferCreationAttributes<SightingModel>> {
    id: CreationOptional<number>;
    photoUrl: string;
    title: string;
    description: string | null;
    latitude: number;
    longitude: number;
    address: string | null;
    username: string;
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
            validate: {
                notEmpty: true
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        latitude: {
            type: DataTypes.DECIMAL(8,6),
            allowNull: false,
            validate: {
                min: -90,
                max: 90
            },
        },
        longitude: {
            type: DataTypes.DECIMAL(9,6),
            allowNull: false,
            validate: {
                min: -180,
                max: 180
            },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'fk_username',
            validate: {
                notEmpty: true
            }
        },

        // By default, Sequelize adds the createdAt and updatedAt fields to all models
    }, { 
        // Other model options go here
        // NOTE: The actual table name is inferred from the model name (pluralized) by default
        underscored: true,
        validate: {
            bothCoordsOrNone() {
                if ((this.latitude === null) !== (this.longitude === null)) {
                    throw new Error('Either both latitude and longitude, or neither!');
                }
            },
        },
    });

    return Sighting;
}