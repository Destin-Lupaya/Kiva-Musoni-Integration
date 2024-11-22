// Service for interacting with the MUSONI API
import axios from 'axios';
import logger from './logger.js';

class MusoniService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.MUSONI_API_URL,
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${process.env.MUSONI_USERNAME}:${process.env.MUSONI_PASSWORD}`
        ).toString('base64')}`,
        'Content-Type': 'application/json',
        'X-Tenant-Identifier': process.env.MUSONI_TENANT_ID
      }
    });
  }

  // Fetch loan details from MUSONI
  async getLoan(loanId) {
    try {
      const response = await this.api.get(`/loans/${loanId}`);
      return response.data;
    } catch (error) {
      logger.error(`MUSONI API - Get loan error: ${error.message}`);
      throw new Error('Failed to fetch loan from MUSONI');
    }
  }

  // Get client details from MUSONI
  async getClient(clientId) {
    try {
      const response = await this.api.get(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      logger.error(`MUSONI API - Get client error: ${error.message}`);
      throw new Error('Failed to fetch client from MUSONI');
    }
  }

  // Get loan schedule from MUSONI
  async getLoanSchedule(loanId) {
    try {
      const response = await this.api.get(`/loans/${loanId}/schedule`);
      return response.data;
    } catch (error) {
      logger.error(`MUSONI API - Get loan schedule error: ${error.message}`);
      throw new Error('Failed to fetch loan schedule from MUSONI');
    }
  }

  // Update loan status in MUSONI
  async updateLoanStatus(loanId, status) {
    try {
      const response = await this.api.put(`/loans/${loanId}`, {
        status
      });
      return response.data;
    } catch (error) {
      logger.error(`MUSONI API - Update loan status error: ${error.message}`);
      throw new Error('Failed to update loan status in MUSONI');
    }
  }
}

export default new MusoniService();