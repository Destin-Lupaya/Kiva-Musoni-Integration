import express from 'express';
import { register, login } from '../controllers/AuthController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Protected route example
router.get('/profile', protect, (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
    }
  });
});

export default router;