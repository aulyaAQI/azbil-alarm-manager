import {KintoneRestAPIClient} from "@kintone/rest-api-client";
import 'dotenv/config';
import {apps} from './init.js';
import {DateTime} from "luxon";

const dt = DateTime;

const baseUrl = process.env.BASE_URL;
const tableEmployeeWorkingShiftRef = apps.workingShiftManagement.fieldCode.table.employeeData;

const clientCompanyDirectory = new KintoneRestAPIClient({
  baseUrl,
  auth: {
    apiToken: [
      process.env.COMPANY_DIRECTORY_TOKEN
    ]
  }
});

const clientWorkingShiftManagement = new KintoneRestAPIClient({
  baseUrl,
  auth: {
    apiToken: [
      process.env.WORKING_SHIFT_MANAGEMENT_TOKEN
    ]
  }
});

const clientNotificationTimeManagement = new KintoneRestAPIClient({
  baseUrl,
  auth: {
    apiToken: [
      process.env.NOTIFICATION_TIME_MANAGEMENT_TOKEN
    ]
  }
});

export const functions = {
  getAllUser: async () => {
    return clientCompanyDirectory.record.getAllRecords({
      app: process.env.COMPANY_DIRECTORY_APP_ID,
      condition: `${apps.companyDirectory.fieldCode.status} in ("Active")`
    });
  },
  getWorkingShift: async (arrOfEmployeeIdForAbid) => {
    const condition = `${tableEmployeeWorkingShiftRef.columns.employeeId} in (${arrOfEmployeeIdForAbid.map(item => `"${item}"`).join(',')}) or 
      ${apps.workingShiftManagement.fieldCode.default} in ("Yes")
    `;

    return clientWorkingShiftManagement.record.getAllRecords({
      app: process.env.WORKING_SHIFT_MANAGEMENT_APP_ID,
      condition,
    });
  },
  getNotificationTime: async () => {
    const condition = `${apps.notificationTimeManagement.fieldCode.typeReminder} in ("Reminder Clock In/Out")`;
    console.log({condition});

    return clientNotificationTimeManagement.record.getAllRecords({
      app: process.env.NOTIFICATION_TIME_MANAGEMENT_APP_ID,
      condition,
    })
  },
  mapUserData: (users, workingShifts, defaultWorkingShift, reminderTimeRec, currentdDt) => {
    return users.map(item => {
      const findShift = workingShifts.find(workRec => {
        const tableShift = workRec[tableEmployeeWorkingShiftRef.code].value;
  
        return tableShift.find(row => 
          row.value[tableEmployeeWorkingShiftRef.columns.employeeId].value === 
            item[apps.companyDirectory.fieldCode.employeeIdForAbid].value
        );
      });
  
      const mapped = {
        name: item[apps.companyDirectory.fieldCode.employeeName].value,
        employeeIdForAbid: item[apps.companyDirectory.fieldCode.employeeIdForAbid].value,
        findShift: findShift ? true : false,
        // schedule: findShift ? findShift : defaultWorkingShift,
        schedule: findShift ? {
          startTime: findShift[apps.workingShiftManagement.fieldCode.startTime].value,
          endTime: findShift[apps.workingShiftManagement.fieldCode.endTime].value,
        } : {
          startTime: defaultWorkingShift[apps.workingShiftManagement.fieldCode.startTime].value,
          endTime: defaultWorkingShift[apps.workingShiftManagement.fieldCode.endTime].value,
        },
        pushNotifToken: item[apps.companyDirectory.fieldCode.notificationToken].value,
        scheduleDelay: '',
      }


    });
  }
}