'use strict';

const EmployeeModel = require('./models/employee');
const WorkScheduleModel = require('./models/workschedule');

const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const Data = {};

Data.addItem = async (req, res, next) => {
    //console.log(req.body);
    try {
        const data = req.body;
        const item = new EmployeeModel(data);
        await item.save();
        res.status(200).json(item);
    } catch (e) {
        next(e)
    }
}

Data.getAllItems = async (req, res, next) => {
    try {
        const items = await EmployeeModel.find({});
        res.status(200).json(items);
    } catch (e) {
        next(e);
    }
}

Data.getOneItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        const items = await EmployeeModel.find({ _id: id });
        res.status(200).json(items[0]);
    } catch (e) {
        next(e);
    }

}

Data.delete = async (req, res, next) => {
    try {
        let id = req.params.id;
        await EmployeeModel.findByIdAndDelete(id);
        res.status(200).send('Item Deleted');
    } catch (e) {
        next(e)
    }
}

Data.getSchedules = async(req,res,next) =>{
    try{
    let myShcedules = await WorkScheduleModel.find({});
    res.status(200).json(myShcedules);
    }catch{
        next(e)
    }
}

Data.email = async(req,res,next) =>{
    try{
        let myUsers = await EmployeeModel.find({});
        myUsers.map((employee)=>{
            //console.log( `${employee.email} is my person`);
            const msg = {
                to: `${employee.email}`, // Change to your recipient
                from: 'juan.c.olmedo@icloud.com', // Change to your verified sender
                subject: 'Your Work Schedule has been Posted',
                text: 'Please review your Schedule',
                html: 'This will be link to website',
            }
            sgMail
            .send(msg)
            .then(() => {
            console.log('Email sent')
            .catch((error) => {
            console.error(error)
                })
        })
        })

    }catch(e){
        next(e);
    }
}

// Function to get employees from database and populate employees for one schedule at random 
//each workshift will have 1 level 5 and 1 level 4 the other two can be level 1-3 for a total of 4 people per shift 
//Once all three shifts have been generated repeat for a total of 7 days

//may need to pass in right now date so that it can generate 7 days from today 

Data.combo = async(req, res, next)=>{
    
    try{
    let myUsers = await EmployeeModel.find({});
    const numDays= 2
    const date = new Date() //possible location to pass current date back here 

    const globalSchedules =[];
    for(let i = 0; i<numDays; i++){   
        let workscheduleA = {
            weekStartDate: date.setDate(date.getDate()+ i), //sets current date
            dayShift : [],
            midShift : [],
            nightShift : []
        }

        let randomEmployees = shuffleArray(myUsers);
        for(let j =0; j<4; j++){
            let employee = randomEmployees[j];

            if(employee.level === 5){
                if(workscheduleA.dayShift.length<1){   
                    workscheduleA.dayShift.push(employee);
                }else if(workscheduleA.midShift.length<1){
                    workscheduleA.midShift.push(employee)
                }else{
                    workscheduleA.nightShift.push(employee)
                }
            }else if (employee.level ===4){
                if(workscheduleA.dayShift.length<1){
                    workscheduleA.dayShift.push(employee);
                }else if(workscheduleA.midShift.length<1){
                    workscheduleA.midShift.push(employee)
                }else{
                    workscheduleA.nightShift.push(employee)
                }
            } else{
                if(workscheduleA.dayShift.length<2){
                    workscheduleA.dayShift.push(employee)
                }else if(workscheduleA.midShift.length<2){
                    workscheduleA.midShift.push(employee)
                }else{
                    workscheduleA.nightShift.push(employee)
                }
            }
        }

        const newWorkSchedule = new WorkScheduleModel(workscheduleA);
        await newWorkSchedule.save()

        globalSchedules.push(newWorkSchedule);
    }

        

        res.status(200).send(globalSchedules);
        }catch(e){
            next(e);
        }
    }

//to be used for the data.combo
function shuffleArray(array){
    //console.log('made it to the shuffle section');
    let currentIndex = array.length;
    let tempValue;
    let randomIndex;
    
    while(currentIndex !=0){
        randomIndex = Math.floor(Math.random()*currentIndex);
        currentIndex -= 1;
        tempValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempValue;
    }

    return array;
    
}











module.exports = Data;