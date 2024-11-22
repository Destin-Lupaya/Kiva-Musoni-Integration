// Service for interacting with the KIVA API
import axios from 'axios';
import logger from './logger.js';

class KivaService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.KIVA_API_URL,
      headers: {
        'Authorization': `Bearer ${process.env.KIVA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Fetch loan details from KIVA
  async getLoan(kivaId) {
    try {
      const response = await this.api.get(`/loans/${kivaId}`);
      return response.data;
    } catch (error) {
      logger.error(`KIVA API - Get loan error: ${error.message}`);
      throw new Error('Failed to fetch loan from KIVA');
    }
  }

  // Post a journal update to KIVA
  async postJournal({ loan_id, body, subject, image_url }) {
    try {
      const response = await this.api.post(`/loans/${loan_id}/journals`, {
        body,
        subject,
        image_url
      });
      return response.data;
    } catch (error) {
      logger.error(`KIVA API - Post journal error: ${error.message}`);
      throw new Error('Failed to post journal to KIVA');
    }
  }

  // Submit a loan draft to KIVA
  async submitLoanDraft(draft) {
    try {
      const response = await this.api.post('/loans/drafts', {
        activity_id: draft.activity_id,
        description: draft.description,
        loan_amount: draft.amounts.requested,
        borrower_count: 1,
        themes: [draft.theme_type_id],
        location: draft.location,
        loan_use: draft.loanuse,
        borrower_details: {
          first_name: draft.first_name,
          last_name: draft.last_name,
          gender: draft.gender
        }
      });
      return response.data;
    } catch (error) {
      logger.error(`KIVA API - Submit loan draft error: ${error.message}`);
      throw new Error('Failed to submit loan draft to KIVA');
    }
  }
}

export default new KivaService();