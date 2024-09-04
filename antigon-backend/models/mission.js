const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  skills: [String],
  status: { type: String, enum: ['open', 'in_progress', 'completed'], default: 'open' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Mission', MissionSchema);