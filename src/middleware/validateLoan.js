// Middleware for validating loan-related requests
import { body, validationResult } from 'express-validator';

export const validateLoanSync = [
  body('musoniLoanId').notEmpty().withMessage('Musoni loan ID is required'),
  body('kivaId').notEmpty().withMessage('Kiva ID is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];