// starter code for mondoDB logic for card 2
const mongoose = require('mongoose');
const scheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  event: { type: String, required: true },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
