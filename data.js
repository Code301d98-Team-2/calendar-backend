"use strict";

const EmployeeModel = require("./models/employee");
const WorkScheduleModel = require("./models/workschedule");

const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Data = {};

Data.addItem = async (req, res, next) => {
  //console.log(req.body);
    try {
    const data = req.body;
    const item = new EmployeeModel(data);
    await item.save();
    res.status(200).json(item);
    } catch (e) {
    next(e);
    }
};

Data.getAllItems = async (req, res, next) => {
    try {
    const items = await EmployeeModel.find({});
    res.status(200).json(items);
    } catch (e) {
    next(e);
    }
};

Data.getOneItem = async (req, res, next) => {
    try {
    const id = req.params.id;
    const items = await EmployeeModel.find({ _id: id });
    res.status(200).json(items[0]);
    } catch (e) {
    next(e);
    }
};

Data.delete = async (req, res, next) => {
    try {
    let id = req.params.id;
    await EmployeeModel.findByIdAndDelete(id);
    res.status(200).send("Item Deleted");
    } catch (e) {
    next(e);
    }
};

Data.getSchedules = async (req, res, next) => {
    try {
    let myShcedules = await WorkScheduleModel.find({});
    res.status(200).json(myShcedules);
    } catch {
    next(e);
    }
};

Data.getEmpSchedules = async (req, res, next) => {
    try {
    let mySchedules = await WorkScheduleModel.find({});
    console.log(mySchedules);

    helperShiftGenerator(mySchedules).then((refinedSchedule) => {
    console.log(refinedSchedule);
    res.status(200).send(refinedSchedule);
    });
    } catch (e) {
    next(e);
    }
};


async function helperShiftGenerator(arr) {
  // iterate over each work schedule
    const schedulesWithEmployees = await Promise.all(
    arr.map(async (schedule) => {
      // fetch employee info for day shift
    const dayShiftEmployees = await Promise.all(
        schedule.dayShift.map(async (employeeId) => {
        const employee = await EmployeeModel.findById(employeeId);
        return {
            firstName: employee.firstName,
            lastName: employee.lastName,
            level: employee.level,
            };
        })
    );

      // fetch employee info for mid shift
    const midShiftEmployees = await Promise.all(
        schedule.midShift.map(async (employeeId) => {
        const employee = await EmployeeModel.findById(employeeId);
        return {
            firstName: employee.firstName,
            lastName: employee.lastName,
            level: employee.level,
        };
        })
    );

      // fetch employee info for night shift
    const nightShiftEmployees = await Promise.all(
        schedule.nightShift.map(async (employeeId) => {
        const employee = await EmployeeModel.findById(employeeId);
        return {
            firstName: employee.firstName,
            lastName: employee.lastName,
            level: employee.level,
        };
        })
    );

      // combine employee info for all shifts into a single object
    return {
        date: schedule.date,
        dayShift: dayShiftEmployees.map((employee) => ({
        ...employee,
        date: schedule.date,
        })),
        midShift: midShiftEmployees.map((employee) => ({
        ...employee,
        date: schedule.date,
        })),
        nightShift: nightShiftEmployees.map((employee) => ({
        ...employee,
        date: schedule.date,
        })),
    };
    })
);

  // return the final array of schedules with employee info
  return schedulesWithEmployees;
}

Data.email = async (req, res, next) => {
    try {
    let myUsers = await EmployeeModel.find({});
    myUsers.map((employee) => {
      //console.log( `${employee.email} is my person`);
        const msg = {
        to: `${employee.email}`, // Change to your recipient
        from: "juan.c.olmedo@icloud.com", // Change to your verified sender
        subject: "Your Work Schedule has been Posted",
        text: "Please review your Schedule",
        html: "This will be link to website",
        };
        sgMail.send(msg).then(() => {
        console.log("Email sent").catch((error) => {
            console.error(error);
        });
        });
    });
    } catch (e) {
    next(e);
    }
};

Data.combo = async (req, res, next) => {
    try {
        let myUsers = await EmployeeModel.find({});
        const numDays = 1;
        let date = new Date(); //possible location to pass current date back here

        const globalSchedules = [];

        for (let i = 0; i < numDays; i++) {

            let workscheduleA = {
            date: date.setDate(date.getDate() + (i + 1)), //sets current date
            dayShift: [],
            midShift: [],
            nightShift: [],
            };

            let randomEmployees = shuffleArray(myUsers);
            let daylevel5Found = false;
            let daylevel4Found = false;
            let midlevel5Found = false;
            let midlevel4Found = false;
            let nightlevel5Found = false;
            let nightlevel4Found = false;

            do{
                
                for (let j = 0; j < randomEmployees.length; j++) {
            
                let employee = randomEmployees[j];

                if (employee.level === 5 && !daylevel5Found) {
                    workscheduleA.dayShift.push(employee);
                    daylevel5Found = true;  
                } else if (employee.level === 4 && !daylevel4Found) {
                    workscheduleA.dayShift.push(employee);
                    daylevel4Found = true;
                }else if (employee.level === 5 && !midlevel5Found) {
                    workscheduleA.midShift.push(employee);
                    midlevel5Found = true;  
                } else if (employee.level === 4 && !midlevel4Found) {
                    workscheduleA.midShift.push(employee);
                    midlevel4Found = true;
                }else if (employee.level === 5 && !nightlevel5Found) {
                    workscheduleA.nightShift.push(employee);
                    nightlevel5Found = true;  
                } else if (employee.level === 4 && !nightlevel4Found) {
                    workscheduleA.nightShift.push(employee);
                    nightlevel4Found = true;
                } else if (employee.level >= 1 && employee.level <= 3) {
                    if (workscheduleA.dayShift.length < 3) {
                        workscheduleA.dayShift.push(employee);
                    } else if (workscheduleA.midShift.length < 3) {
                        workscheduleA.midShift.push(employee);
                    } else if(workscheduleA.nightShift.length<3) {
                        workscheduleA.nightShift.push(employee);
                    }else{
                        console.log('no place to put', employee);
                    }
                    
                }
                
            }
            }while(workscheduleA.dayShift.length < 5 && workscheduleA.midShift <5 && workscheduleA.nightShift < 5);
            const newWorkSchedule = new WorkScheduleModel(workscheduleA);
            await newWorkSchedule.save();
            
            res.status(200).send('success');
        }
    } catch (e) {
    next(e);
    }
};

//to be used for the data.combo
function shuffleArray(array) {
  //console.log('made it to the shuffle section');
    let currentIndex = array.length;
    let tempValue;
    let randomIndex;

    while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    tempValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = tempValue;
    }

    return array;
}

module.exports = Data;
