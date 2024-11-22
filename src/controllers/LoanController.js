// Controller handling loan-related operations between Kiva and Musoni
import { Loan, LoanDraft } from '../models/index.js';
import KivaService from '../services/KivaService.js';
import MusoniService from '../services/MusoniService.js';
import logger from '../services/logger.js';

export const syncLoan = async (req, res) => {
  try {
    const { musoniLoanId, kivaId } = req.body;
    logger.info(`Syncing loan: Musoni ID ${musoniLoanId}, Kiva ID ${kivaId}`);

    // Fetch data from both APIs
    const [kivaLoan, musoniLoan] = await Promise.all([
      KivaService.getLoan(kivaId),
      MusoniService.getLoan(musoniLoanId)
    ]);

    const loan = await Loan.upsert({
      internal_loan_id: musoniLoanId,
      kiva_id: kivaId,
      internal_client_id: musoniLoan.clientId,
      status: musoniLoan.status,
      loan_currency: musoniLoan.currency,
      loan_local_price: musoniLoan.amount,
      name: `${musoniLoan.firstName} ${musoniLoan.lastName}`,
      create_time: new Date()
    });

    logger.info(`Loan synced successfully: ${musoniLoanId}`);
    res.json({ status: 'success', data: loan });
  } catch (error) {
    logger.error('Loan sync error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findOne({
      where: { internal_loan_id: loanId },
      include: [LoanDraft]
    });

    if (!loan) {
      return res.status(404).json({ status: 'error', message: 'Loan not found' });
    }

    res.json({ status: 'success', data: loan });
  } catch (error) {
    logger.error('Get loan status error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findOne({
      where: { internal_loan_id: loanId },
      include: [LoanDraft]
    });

    if (!loan) {
      return res.status(404).json({ status: 'error', message: 'Loan not found' });
    }

    res.json({ status: 'success', data: loan });
  } catch (error) {
    logger.error('Get loan status error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};