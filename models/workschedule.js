'use strict';

const mongoose = require('mongoose');

const {Schema} = mongoose;

const workSchema = new Schema({

    weekStartDate: {type:Date, required:true},

    dayShift: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee', 
        startTime: {type:Date, default: "6:30 am"},
        endTime: { type: Date, default: "3:00 pm" },
    }],

    midShift: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        startTime: { type: Date, default: "2:30 pm" },
        endTime: { type: Date, default: "11:00 pm" },
    }],

    nightShift: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        startTime: { type: Date, default: "9:00 pm" },
        endTime: { type: Date, default: "5:00 am" },
    }]

})


const WorkSchedule = mongoose.model('workschedule',workSchema);

module.exports = WorkSchedule