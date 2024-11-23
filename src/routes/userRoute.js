import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();

// Routes CRUD
router.post('/users', UserController.createUser); // Créer un utilisateur
router.get('/users', UserController.getAllUsers); // Obtenir tous les utilisateurs
router.get('/users/:id', UserController.getUserById); // Obtenir un utilisateur par ID
router.put('/users/:id', UserController.updateUser); // Mettre à jour un utilisateur
router.delete('/users/:id', UserController.deleteUser); // Supprimer un utilisateur

export default router;
