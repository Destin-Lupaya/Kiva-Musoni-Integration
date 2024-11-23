import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const UserController = {
  // Créer un utilisateur
  createUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validation des champs
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis : nom, email et mot de passe.' });
      }

      // Création de l'utilisateur
      const user = await User.create({ name, email, password });
      res.status(201).json({
        message: 'Utilisateur créé avec succès.',
        user: { id: user.id, name: user.name, email: user.email } // Ne pas retourner le mot de passe
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Obtenir tous les utilisateurs
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({ attributes: ['id', 'name', 'email'] }); // Exclure le mot de passe
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtenir un utilisateur par son ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, { attributes: ['id', 'name', 'email'] }); // Exclure le mot de passe

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10); // Hacher le nouveau mot de passe

      await user.save();

      res.status(200).json({
        message: 'Utilisateur mis à jour avec succès.',
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      await user.destroy();
      res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default UserController;
