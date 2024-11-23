import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import sequelize from './config/database.js'; // L'instance Sequelize configurée

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);

// Synchronisation et démarrage du serveur
(async () => {
  try {
    await sequelize.sync();
    console.log('Base de données synchronisée.');

    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage :', error.message);
  }
})();

// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);
