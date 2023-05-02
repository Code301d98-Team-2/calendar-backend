'use strict';

const mongoose = require('mongoose');

const {Schema} = mongoose;

const employeeSchema = new Schema({
    firstName : {type: String, required: true, trim:true},
    lastName : {type: String, required: true,trim:true},
    employeeId: {type: Number, required: true}, //, match: /^[A-Za-z]\d{5}$/ letter and five digits
    email:{type:String, required: true, trim:true},
    level: {type: Number, required: true, min:1, max:5}
})


const Employee = mongoose.model('employee', employeeSchema);

module.exports = Employee;