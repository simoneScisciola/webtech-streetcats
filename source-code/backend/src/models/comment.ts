import { DataTypes, Model, InferAttributes, InferCreationAttributes, Sequelize, CreationOptional } from "sequelize"; // Sequelize ORM (https://sequelize.org/)


interface CommentModel extends Model<InferAttributes<CommentModel>, InferCreationAttributes<CommentModel>> {
    id: CreationOptional<number>;
    content: string;
    username: string;
    sightingId: number;
}

/**
 * Defines the Comment model
 * @param database The database object returned by the ORM connection
 */
export function createModel(database: Sequelize) {
    
    const Comment = database.define<CommentModel>('Comment', {
        
        // Define the model attributes
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
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
        sightingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'fk_sighting_id'
        },

        // By default, Sequelize adds the createdAt and updatedAt fields to all models
    }, { 
        // Other model options go here
        // NOTE: The actual table name is inferred from the model name (pluralized) by default
        underscored: true
    });

    Comment.prototype.toJSON = function () {
        const values = { ...this.get({ plain: true }) };

        // Delete foreign key field to avoid confusion
        delete values.fk_username;
        delete values.fk_sighting_id;

        return values;
    };

    return Comment;
}