const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Commende = sequelize.define(
  'Commende',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    idProduit: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'produits',
        key: 'id'
      }
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    nomComplet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adresse: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    statut: {
      type: DataTypes.ENUM('en_attente', 'confirmee', 'livree', 'annulee'),
      defaultValue: 'en_attente',
    },
    dateCommande: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'commendes',
    timestamps: true, // createdAt, updatedAt
  }
);

// Relation avec Produit
const Produit = require('./produit.model');
Commende.belongsTo(Produit, {
  foreignKey: 'idProduit',
  as: 'produit',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Produit.hasMany(Commende, {
  foreignKey: 'idProduit',
  as: 'commandes',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = Commende;