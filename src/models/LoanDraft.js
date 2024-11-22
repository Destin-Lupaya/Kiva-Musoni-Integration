// LoanDraft model for managing loan drafts before submission to Kiva
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const LoanDraft = sequelize.define('LoanDraft', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activity_id: DataTypes.INTEGER,
  client_waiver_signed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  description_language_id: DataTypes.INTEGER,
  disburse_time: DataTypes.DATE,
  entreps: {
    type: DataTypes.JSON,
    comment: 'Entrepreneur details in JSON format'
  },
  amounts: {
    type: DataTypes.JSON,
    comment: 'Loan amount details in JSON format'
  },
  client_id: DataTypes.STRING,
  first_name: DataTypes.STRING,
  gender: DataTypes.STRING,
  last_name: DataTypes.STRING,
  loan_id: DataTypes.STRING,
  group_name: DataTypes.STRING,
  image_encoded: DataTypes.TEXT,
  internal_client_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  internal_loan_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  loanuse: DataTypes.TEXT,
  location: {
    type: DataTypes.JSON,
    comment: 'Location details in JSON format'
  },
  not_pictured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  schedule: {
    type: DataTypes.JSON,
    comment: 'Loan schedule details in JSON format'
  },
  theme_type_id: DataTypes.INTEGER
}, {
  tableName: 'loan_drafts',
  timestamps: true
});

export default LoanDraft;