// starter code for schedule data cache

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 60 });

// Define the API endpoint to retrieve schedule data for the next 30 days
app.get('/schedule', async (req, res) => {
try {
    // Check if data exists in cache
    const key = 'schedule_data';
    const cachedData = cache.get(key);
    if (cachedData) {
    return res.status(200).json(cachedData);
    }

    // Calculate the start and end dates for the next 30 days
    const today = new Date();
    const startDate = today.toISOString().substr(0, 10);
    const endDate = new Date(today.setDate(today.getDate() + 30)).toISOString().substr(0, 10);

    // Query the database for schedule data between the start and end dates
    const schedule = await Schedule.find({ date: { $gte: startDate, $lte: endDate } });

    // Cache the data for 1 hour
    cache.set(key, schedule, 3600);

    // Return the schedule data as a JSON response
    res.status(200).json(schedule);
} catch (error) {
    console.error(error);
    res.status(500).send('Error fetching schedule data');
}
});
