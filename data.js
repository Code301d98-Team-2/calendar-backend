'use strict';

const EmployeeModel = require('./models/employee');
const WorkScheduleModel = require('./models/workschedule');

const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const Data = {};

Data.addItem = async(req, res, next)=>{
    //console.log(req.body);
    try{
        const data = req.body;
        const item = new EmployeeModel(data);
        await item.save();
        res.status(200).json(item);
    }catch(e){
        next(e)
    }
}

Data.getAllItems = async(req,res, next) => {
    try{
        const items = await EmployeeModel.find({});
        res.status(200).json(items);
    }catch(e){
        next(e);
    }
}

Data.getOneItem = async(req,res,next)=>{
    try{
        const id = req.params.id;
        const items = await EmployeeModel.find({_id:id});
        res.status(200).json(items[0]);
    }catch(e){
        next(e);
    }

}

Data.delete = async(req,res,next) =>{
    try{
        let id = req.params.id;
        await EmployeeModel.findByIdAndDelete(id);
        res.status(200).send('Item Deleted');
    }catch(e){
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

    const shiftTimes = [ { name: 'dayShift', start: '06:30', end: '15:00' }, { name: 'midshift', start: '14:30', end: '23:00' }, { name: 'nightshift', start: '21:00', end: '05:00' }];

    for(let i = 0; i<numDays; i++){
        date.setDate(date.getDate()+ i) //sets current date
        console.log(date);
        const dayshift =[];
        const midshift = [];
        const nightshift = [];

        let randomEmployees = shuffleArray(myUsers);

        for(let j =0; j<4; j++){
            
        }




        

        for(const shift of shiftTimes){
            //generate array for employee levels
            const level5Employees = myUsers.filter(emp => emp.level ===5);
            const level4Employees = myUsers.filter(emp => emp.level ===4);
            const level1to3Employees = myUsers.filter(emp => emp.level >=1 && emp.level <=3);
            
            //shuffle generated arrays
            shuffleArray(level5Employees);
            shuffleArray(level4Employees);
            shuffleArray(level1to3Employees);
            
            //console.log(level5Employees);
            
            const selectedEmployees = [];

            dayshift.push(level5Employees.pop());
            dayshift.push(level4Employees.pop());
            dayshift.push(level1to3Employees.pop());
            dayshift.push(level1to3Employees.pop());

            midshift.push(level5Employees.pop());
            midshift.push(level4Employees.pop());
            midshift.push(level1to3Employees.pop());
            midshift.push(level1to3Employees.pop());
            
            nightshift.push(level5Employees.pop());
            nightshift.push(level4Employees.pop());
            nightshift.push(level1to3Employees.pop());
            nightshift.push(level1to3Employees.pop());
            
            const newWorkSchedule = new WorkScheduleModel({
                weekStartDate: date,
                dayshift : dayshift,
                midshift : midshift,
                nightshift : nightshift
            })

            
            //await newWorkSchedule.save()
        }
        
    }

    res.status(200).send(dayshift);
        }catch(e){
            next(e);
        }
};

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