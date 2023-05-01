'use strict';

const mongoose = require('mongoose');

require('dotenv').config();
mongoose.connect(process.env.DB_URL);

const employeeSchema = require('./models/employee');

async function seed() {
    await employeeSchema.create({
        firstName: 'Joshua',
        lastName: 'Coffey',
        employeeId: 23,
        email: 'itsjoshcoffey@gmail.com',
        level: 1
    });

    console.log('josh');

    await employeeSchema.create({
        firstName: 'Juan',
        lastName: 'Olmeda',
        employeeId: 7,
        email: 'itsjoshcoffey@gmail.com',
        level: 2
    });

    console.log('Juan');

    await employeeSchema.create({
        firstName: 'Kyle',
        lastName: 'White',
        employeeId: 99,
        email: 'itsjoshcoffey@gmail.com',
        level: 3
    });

    console.log('Kyle');

    await employeeSchema.create({
        firstName: 'Yaz',
        lastName: 'Ahmed',
        employeeId: 1,
        email: 'itsjoshcoffey@gmail.com',
        level: 4
    });

    console.log('Yaz');

    await employeeSchema.create({
        firstName: 'Jeanette',
        lastName: 'Leyva',
        employeeId: 12,
        email: 'itsjoshcoffey@gmail.com',
        level: 5
    });

    console.log('Jeannette');

    mongoose.disconnect();
}

seed();