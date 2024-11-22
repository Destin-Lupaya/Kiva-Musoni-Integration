// Controller for handling synchronization between KIVA and MUSONI
import { Loan, LoanDraft, Journal } from '../models/index.js';
import KivaService from '../services/KivaService.js';
import MusoniService from '../services/MusoniService.js';
import logger from '../services/logger.js';

export const syncLoanToKiva = async (req, res) => {
  try {
    const { musoniLoanId } = req.body;
    logger.info(`Starting loan sync to KIVA for Musoni loan: ${musoniLoanId}`);

    // Fetch loan and client details from MUSONI
    const [musoniLoan, musoniClient, loanSchedule] = await Promise.all([
      MusoniService.getLoan(musoniLoanId),
      MusoniService.getClient(musoniLoan.clientId),
      MusoniService.getLoanSchedule(musoniLoanId)
    ]);

    // Prepare loan draft for KIVA
    const loanDraft = await LoanDraft.create({
      internal_loan_id: musoniLoanId,
      internal_client_id: musoniLoan.clientId,
      currency: musoniLoan.currency,
      amounts: {
        requested: musoniLoan.principal,
        funded: 0
      },
      first_name: musoniClient.firstName,
      last_name: musoniClient.lastName,
      gender: musoniClient.gender,
      description: musoniLoan.description || 'Loan for business purposes',
      loanuse: musoniLoan.purpose,
      schedule: loanSchedule,
      location: {
        country: musoniClient.address.country,
        city: musoniClient.address.city,
        geo: musoniClient.address.coordinates
      }
    });

    // Submit draft to KIVA
    const kivaResponse = await KivaService.submitLoanDraft(loanDraft);

    // Update loan record with KIVA ID
    const loan = await Loan.create({
      internal_loan_id: musoniLoanId,
      internal_client_id: musoniLoan.clientId,
      kiva_id: kivaResponse.id,
      status: 'pending_approval',
      loan_currency: musoniLoan.currency,
      loan_local_price: musoniLoan.principal,
      name: `${musoniClient.firstName} ${musoniClient.lastName}`,
      create_time: new Date()
    });

    logger.info(`Loan successfully synced to KIVA: ${musoniLoanId} -> ${kivaResponse.id}`);
    res.json({
      status: 'success',
      data: {
        loan,
        kiva_id: kivaResponse.id
      }
    });
  } catch (error) {
    logger.error('Loan sync to KIVA error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const syncLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    logger.info(`Syncing loan status for: ${loanId}`);

    const loan = await Loan.findOne({
      where: { internal_loan_id: loanId }
    });

    if (!loan) {
      return res.status(404).json({
        status: 'error',
        message: 'Loan not found'
      });
    }

    // Get status from both systems
    const [kivaLoan, musoniLoan] = await Promise.all([
      KivaService.getLoan(loan.kiva_id),
      MusoniService.getLoan(loan.internal_loan_id)
    ]);

    // Update local status
    await loan.update({
      status: musoniLoan.status,
      kiva_status: kivaLoan.status
    });

    logger.info(`Loan status synced: ${loanId}`);
    res.json({
      status: 'success',
      data: {
        loan_id: loanId,
        musoni_status: musoniLoan.status,
        kiva_status: kivaLoan.status
      }
    });
  } catch (error) {
    logger.error('Loan status sync error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};