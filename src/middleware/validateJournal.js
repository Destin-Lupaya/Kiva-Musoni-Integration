// Middleware for validating journal-related requests
import { body, validationResult } from 'express-validator';

export const validateJournalCreate = [
  body('internal_loan_id').notEmpty().withMessage('Internal loan ID is required'),
  body('body').notEmpty().withMessage('Journal body is required'),
  body('subject').notEmpty().withMessage('Journal subject is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];