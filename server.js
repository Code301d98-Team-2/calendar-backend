'use strict';

//Imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
//bring in employee model to this page to be used
const Employee = require('./models/employee')
// email API
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// bring in auth.js to be used as middleware
const verifyUser = require('./auth.js');
const Data = require('./data');
const e = require('cors');
const app = express();
const scheduleController = require('./controllers/schedule');
const Schedule = require('./models/schedule');

// define token and secret key to verify jwt token
// this entire step is for "Setup authentication and authorization on the API endpoint." for card 2.
 // define token and secret key to verify jwt token
const jwt = require('jsonwebtoken');
const secretKey = 'my_secret_key';
app.use(cors());
//important will not get .body in response without this
app.use(express.json());

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB database connection established successfully');
});

// Define a middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
};

// Define a login API endpoint to generate JWT token
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if user exists in database and verify password

  // Generate JWT token
  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
  res.status(200).json({ token });
});

// Protect the /schedule API endpoint with the verifyToken middleware
app.get('/schedule', verifyToken, async (req, res) => {
  try {
    // Check if data exists in cache

    // Calculate the start and end dates for the next 30 days

    // Query the database for schedule data between the start and end dates

    // Cache the data for 1 hour

    // Return the schedule data as a JSON response
    res.status(200).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching schedule data');
  }
});

// Define a Schedule schema and model
// this entire schema step is for card 2
const scheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  event: { type: String, required: true },
});
const Schedule = mongoose.model('Schedule', scheduleSchema);
// Define the API endpoint to retrieve schedule data for the next 30 days
app.get('/schedule', async (req, res) => {
  try {
    // Calculate the start and end dates for the next 30 days
    const today = new Date();
    const startDate = today.toISOString().substr(0, 10);
    const endDate = new Date(today.setDate(today.getDate() + 30)).toISOString().substr(0, 10);

    // Query the database for schedule data between the start and end dates
    const schedule = await Schedule.find({ date: { $gte: startDate, $lte: endDate } });

    // Return the schedule data as a JSON response
    res.status(200).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching schedule data');
  }
});
// imports scheduleController module and maps the /schedule 
//  route to the get Schedule function which handles requests for API endpoint
exports.getSchedule = async (req, res) => {
  // code to fetch schedule data from MongoDB
};

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Good listening on PORT: ${PORT}`);
});

app.get('/test', sendEmail)
app.get('/', (req, res) => {
  res.send('The server is working');
})
// controllers/schedule.js
app.get('/schedule', scheduleController.getSchedule);
app.post('/postemployee', Data.addItem)
app.get('/getallemployees', Data.getAllItems)
//Need the get item to be modified in the event there is an error 


//testing email API
function sendEmail(req, res, next) {
  const msg = {
    to: 'doubleparked88@gmail.com', // Change to your recipient
    from: 'juan.c.olmedo@icloud.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}
// verify that there is a user coming in.*calling middleware-->*
app.use(verifyUser);
app.get('*', (request, response) => {
  response.status(404).send('Not available');
});

// ERROR
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});


// backend auth.js * Change "getEmployees" when necessary
// email property will match user email based off middleware

// async function getEmployees(req, res) {
//   try {
//   const employees = await Employee.find({email: req.user.email});
//   res.status(200).json(employees);
// } catch (e) {
//   console.error(e);
//   res.status(500).send(e);
// }
// }


