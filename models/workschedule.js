'use strict';

const mongoose = require('mongoose');

const {Schema} = mongoose;

const workSchema = new Schema({

    weekStartDate: {type:Date, required:true},

    dayShift: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee', 
    }],
    // startTime: {type:Date, default: "12:00 am"},
    // endTime: { type: Date, default: "8:00 am" },

    midShift: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
    }],
    // startTime: { type: Date, default: "8:00 am" },
    // endTime: { type: Date, default: "4: 00 pm" },

    nightShift: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
    }],
    // startTime: { type: Date, default: "4:00 pm" },
    // endTime: { type: Date, default: "12:00 am" },

})


const WorkSchedule = mongoose.model('workschedule',workSchema);

module.exports = WorkSchedule