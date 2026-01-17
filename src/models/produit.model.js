const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Produit = sequelize.define(
  'Produit',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM('OEUF', 'POUSSIN', 'POULET'),
      allowNull: false,
    },

    prix: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING, // URL ou nom du fichier
      allowNull: true,
    },

    statut: {
      type: DataTypes.ENUM('actif', 'inactif'),
      defaultValue: 'actif',
    },
  },
  {
    tableName: 'produits',
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = Produit;
