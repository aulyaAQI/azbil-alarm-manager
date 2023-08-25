import {functions} from './functions.js';
import {apps} from './init.js';
import {DateTime} from 'luxon';
import util, { inspect } from 'util';

const dt = DateTime;

(async () => {
  const currentdDt = dt.now();
  functions.log({executionTime: currentdDt.toISO()});

  const users = await functions.getAllActiveUsers();
  const arrOfEmployeeIdForAbid = users.map(item => item[apps.companyDirectory.fieldCode.employeeIdForAbid].value);
  const workingShifts = await functions.getWorkingShift(arrOfEmployeeIdForAbid);
  const defaultWorkingShift = workingShifts.find(item => item[apps.workingShiftManagement.fieldCode.default].value.length);
  const reminderTimeRec = await functions.getNotificationTime();
  const mapUser = functions.mapUserData(users, workingShifts, defaultWorkingShift, reminderTimeRec, currentdDt);

  mapUser.forEach(item => {
    item.shifts.forEach(shift => {
      functions.scheduleNotif(item, shift);
    });
  });

})();