const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');

// POST inscription d'un nouvel utilisateur
router.post('/register', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });

    user = new User(req.body);
    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST connexion d'un utilisateur
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET profil de l'utilisateur
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT mise à jour du profil de l'utilisateur
router.put('/profile', auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    // Mettez à jour les champs autorisés
    const { name, email, skills, bio } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (skills) user.skills = skills;
    if (bio) user.bio = bio;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;