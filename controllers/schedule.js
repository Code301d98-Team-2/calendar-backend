// starter code for mondoDB logic for card 2
// defines a getSchedule function that retrieves schedule data for the next 30 days 
// by querying the 'schedule' model using mongoose
const Schedule = require('../models/schedule');

exports.getSchedule = async (req, res) => {
  try {
    const today = new Date();
    const startDate = today.toISOString().substr(0, 10);
    const endDate = new Date(today.setDate(today.getDate() + 30)).toISOString().substr(0, 10);

    const schedule = await Schedule.find({ date: { $gte: startDate, $lte: endDate } });
    res.status(200).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching schedule data');
  }
};