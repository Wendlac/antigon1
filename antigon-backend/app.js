const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

const connectDB = require('./db');
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Antigon' });
});

// Routes pour les missions (à implémenter)
const missionRoutes = require('./routes/missions');
app.use('/api/missions', missionRoutes);

// Routes pour les utilisateurs (à implémenter)
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Une erreur est survenue !');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

module.exports = app;