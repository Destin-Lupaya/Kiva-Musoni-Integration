// Loan model representing the main loans table linking Kiva and Musoni
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Journal from './Journal.js';
import LoanDraft from './LoanDraft.js';

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  borrower_count: DataTypes.INTEGER,
  create_time: DataTypes.DATE,
  defaulted_time: DataTypes.DATE,
  delinquent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ended_time: DataTypes.DATE,
  expired_time: DataTypes.DATE,
  internal_client_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Musoni client ID'
  },
  internal_loan_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Musoni loan ID'
  },
  issue_feedback_time: DataTypes.DATE,
  issue_reported_by: DataTypes.STRING,
  kiva_id: {
    type: DataTypes.STRING,
    unique: true,
    comment: 'Kiva loan ID'
  },
  loan_currency: DataTypes.STRING,
  loan_local_price: DataTypes.DECIMAL(10, 2),
  loan_price: DataTypes.DECIMAL(10, 2),
  location: {
    type: DataTypes.JSON,
    comment: 'Location details in JSON format'
  },
  name: DataTypes.STRING,
  partner: DataTypes.STRING,
  partner_id: DataTypes.STRING,
  planned_expiration_time: DataTypes.DATE,
  planned_inactive_expire_time: DataTypes.DATE,
  refunded_time: DataTypes.DATE,
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status_detail: DataTypes.STRING,
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  }
}, {
  tableName: 'loans',
  timestamps: true
});

// Define relationships
Loan.hasMany(Journal, {
  foreignKey: 'internal_loan_id',
  sourceKey: 'internal_loan_id'
});

Loan.hasOne(LoanDraft, {
  foreignKey: 'internal_loan_id',
  sourceKey: 'internal_loan_id'
});

Journal.belongsTo(Loan, {
  foreignKey: 'internal_loan_id',
  targetKey: 'internal_loan_id'
});

LoanDraft.belongsTo(Loan, {
  foreignKey: 'internal_loan_id',
  targetKey: 'internal_loan_id'
});

export default Loan;