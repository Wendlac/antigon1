const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const Mission = require('../models/mission');

// GET toutes les missions
router.get('/', async (req, res) => {
  try {
    const missions = await Mission.find();
    res.json(missions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET une mission spécifique
router.get('/:id', getMission, (req, res) => {
  res.json(res.mission);
});

// POST créer une nouvelle mission
router.post('/', auth, async (req, res) => {
  const mission = new Mission(req.body);
  try {
    const newMission = await mission.save();
    res.status(201).json(newMission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT mettre à jour une mission
router.put('/:id', getMission, async (req, res) => {
  if (req.body.title != null) {
    res.mission.title = req.body.title;
  }
  // Ajoutez d'autres champs à mettre à jour ici
  try {
    const updatedMission = await res.mission.save();
    res.json(updatedMission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE supprimer une mission
router.delete('/:id', getMission, async (req, res) => {
  try {
    await res.mission.remove();
    res.json({ message: 'Mission supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getMission(req, res, next) {
  try {
    mission = await Mission.findById(req.params.id);
    if (mission == null) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.mission = mission;
  next();
}

module.exports = router;

router.get('/search', async (req, res) => {
  try {
    let query = {};
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }
    if (req.query.maxBudget) {
      query.budget = { $lte: parseInt(req.query.maxBudget) };
    }
    if (req.query.skills) {
      query.skills = { $in: [req.query.skills] };
    }
    if (req.query.location) {
      query.location = req.query.location;
    }
    const missions = await Mission.find(query);
    res.json(missions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});