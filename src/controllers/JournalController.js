// Controller handling journal operations
import { Journal, Loan } from '../models/index.js';
import KivaService from '../services/KivaService.js';
import logger from '../services/logger.js';

export const createJournal = async (req, res) => {
  try {
    const { internal_loan_id, body, subject, image_url } = req.body;
    logger.info(`Creating journal for loan: ${internal_loan_id}`);

    // Find associated loan
    const loan = await Loan.findOne({
      where: { internal_loan_id }
    });

    if (!loan) {
      return res.status(404).json({
        status: 'error',
        message: 'Associated loan not found'
      });
    }

    // Create journal entry
    const journal = await Journal.create({
      internal_loan_id,
      internal_client_id: loan.internal_client_id,
      body,
      subject,
      image_url
    });

    // If loan is linked to Kiva, post journal there too
    if (loan.kiva_id) {
      await KivaService.postJournal({
        loan_id: loan.kiva_id,
        body,
        subject,
        image_url
      });
    }

    logger.info(`Journal created successfully: ${journal.id}`);
    res.status(201).json({ status: 'success', data: journal });
  } catch (error) {
    logger.error('Journal creation error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getJournals = async (req, res) => {
  try {
    const { internal_loan_id } = req.params;
    const journals = await Journal.findAll({
      where: { internal_loan_id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ status: 'success', data: journals });
  } catch (error) {
    logger.error('Get journals error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};