const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  creditsEarned: { type: Number, required: true },
  action: { type: String, enum: ['task_completed', 'task_approved', 'bonus'], default: 'task_completed' },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Credit', creditSchema);
