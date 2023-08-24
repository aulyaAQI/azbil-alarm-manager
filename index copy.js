// import {functions} from './functions.js';
// import {apps} from './init.js';
// import {DateTime} from 'luxon';

// const dt = DateTime;

// (async () => {
//   const currentdDt = dt.now();
//   // functions.log({executionTime: currentdDt.toISO()});

//   const users = await functions.getAllActiveUsers();
//   // functions.log({users});
//   const arrOfEmployeeIdForAbid = users.map(item => item[apps.companyDirectory.fieldCode.employeeIdForAbid].value);
//   const workingShifts = await functions.getWorkingShift(arrOfEmployeeIdForAbid);
//   const defaultWorkingShift = workingShifts.find(item => item[apps.workingShiftManagement.fieldCode.default].value.length);
//   const reminderTimeRec = await functions.getNotificationTime();
//   const mapUser = functions.mapUserData(users, workingShifts, defaultWorkingShift, reminderTimeRec, currentdDt);
//   // functions.log({mapUser});
//   console.log({mapUser});

//   mapUser.forEach(item => {
//     item.scheduleDelay.forEach(schedule => {
//       functions.scheduleNotif(item, schedule);
//     });
//   });

// })();