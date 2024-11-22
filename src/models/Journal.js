// Journal model representing the journals table for tracking loan updates
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Journal = sequelize.define('Journal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'The main content of the journal entry'
  },
  image_url: {
    type: DataTypes.STRING,
    comment: 'URL to any associated image'
  },
  internal_client_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Reference to the Musoni client ID'
  },
  internal_loan_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Reference to the Musoni loan ID'
  },
  subject: {
    type: DataTypes.STRING,
    comment: 'Subject/title of the journal entry'
  }
}, {
  tableName: 'journals',
  timestamps: true
});

export default Journal;