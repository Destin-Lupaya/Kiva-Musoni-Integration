// Main API routes configuration
import express from 'express';
import { protect } from '../middleware/auth.js';
import { validateLoanSync } from '../middleware/validateLoan.js';
import { validateJournalCreate } from '../middleware/validateJournal.js';
import * as LoanController from '../controllers/LoanController.js';
import * as JournalController from '../controllers/JournalController.js';
import * as SyncController from '../controllers/SyncController.js';

const router = express.Router();

// Loan routes
router.post('/loans/sync', protect, validateLoanSync, LoanController.syncLoan);
router.get('/loans/:loanId/status', protect, LoanController.getLoanStatus);

// Journal routes
router.post('/journals', protect, validateJournalCreate, JournalController.createJournal);
router.get('/loans/:internal_loan_id/journals', protect, JournalController.getJournals);

// Sync routes
router.post('/sync/loans/kiva', protect, SyncController.syncLoanToKiva);
router.post('/sync/loans/:loanId/status', protect, SyncController.syncLoanStatus);

export default router;