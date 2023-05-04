'use strict';

//Imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// local database
const mongoose = require('mongoose');
//bring in employee model to this page to be used
const Employee = require('./models/employee')
// email API
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//Data Model for cleanup of CRUD methods
const Data = require('./data')
const verifyUser = require('./auth');


const app = express();
app.use(cors());
//important will not get .body in response without this
app.use(express.json());

//NOTE: Connect server to DB
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});
app.post('/employees', async (req, res) => {
  const data = req.body;

  // Validate the employee data
  if (!data.name || !data.email) {
    return res.status(400).send({ error: 'Name and email are required' });
  }

  // Create a new employee document and save it to the database
  try {
    const employee = new Employee(data);
    await employee.save();

    res.send(employee);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Good listening on PORT: ${PORT}`));





app.get('/test', sendEmail) //this will send the email 
app.get('/test2', Data.combo)
app.get('/test3', Data.getEmpSchedules)


app.get('/', (req, res) => {
  res.send('The server is working');
})
// delete and update still needs work.
app.post('/postemployee', Data.addItem) 
app.get('/getallemployees', verifyUser, Data.getAllItems) 
app.get('/getschedules', Data.getSchedules)
// app.get('/deleteemployees', verifyUser, Data.getEmployees)
// app.get('/updateemployees', verifyUser, Data.getSchedules)
// Define the update endpoint URL
app.put('/employees/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  // Validate the updated employee data
  if (!data.name || !data.email) {
    return res.status(400).send({ error: 'Name and email are required' });
  }

  // Update the corresponding employee document in the database
  try {
    const employee = await Employee.findByIdAndUpdate(id, data, { new: true });

    if (!employee) {
      return res.status(404).send({ error: 'Employee not found' });
    }

    res.send(employee);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Define the delete endpoint URL and HTTP method
app.delete('/employees/:id', async (req, res) => {
  const id = req.params.id;

  // Delete theemp loyee document from the database
  try {
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).send({ error: 'Employee not found' });
    }

    res.send(employee);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
});


// end of jeanettes code above.

//testing email API
function sendEmail(req, res, next) {

  const msg = {
    to: 'doubleparked88@gmail.com', // Change to your recipient
    from: 'juan.c.olmedo@icloud.com', // Change to your verified sender
    subject: 'Josh Says Hello',
    text: 'FINALLY WORKS ',
    html: '<strong>There has been an update to the schedule</strong>',
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


app.get('*', (request, response) => {
  response.status(404).send('Not available');
});

// ERROR
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});

