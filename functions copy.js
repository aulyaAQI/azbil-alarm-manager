// import {KintoneRestAPIClient} from '@kintone/rest-api-client';
// import dotenv from 'dotenv';
// import {apps} from './init.js';
// import {DateTime} from 'luxon';
// import axios from 'axios';
// import {createLogger, transports, format} from 'winston';
// import process from 'process';
// import 'winston-daily-rotate-file';
// const {combine, label, json} = format;

// dotenv.config({
//   // path: '/home/kuya/azbil-alarm-manager/.env'
// });

// const dt = DateTime;

// const baseUrl = process.env.BASE_URL;
// const tableEmployeeWorkingShiftRef = apps.workingShiftManagement.fieldCode.table.employeeData;

// const CATEGORY = 'Cron Log';
// const fileRotateTransport = new transports.DailyRotateFile({
//   filename: 'logs/rotate-%DATE%.log',
//   datePattern: 'YYYY-MM-DD',
//   maxFiles: '30d',
// });

// const logger = createLogger({
//   level: 'debug',
//   format: combine(label({label: CATEGORY}), json()),
//   transports: [fileRotateTransport, new transports.Console()],
// });

// const clientCompanyDirectory = new KintoneRestAPIClient({
//   baseUrl,
//   auth: {
//     apiToken: [
//       process.env.COMPANY_DIRECTORY_TOKEN
//     ]
//   }
// });

// const clientWorkingShiftManagement = new KintoneRestAPIClient({
//   baseUrl,
//   auth: {
//     apiToken: [
//       process.env.WORKING_SHIFT_MANAGEMENT_TOKEN
//     ]
//   }
// });

// const clientNotificationTimeManagement = new KintoneRestAPIClient({
//   baseUrl,
//   auth: {
//     apiToken: [
//       process.env.NOTIFICATION_TIME_MANAGEMENT_TOKEN
//     ]
//   }
// });

// export const functions = {
//   log: (logData) => {
//     logger.debug(logData);
//   },
//   getAllActiveUsers: async () => {
//     return clientCompanyDirectory.record.getAllRecords({
//       app: process.env.COMPANY_DIRECTORY_APP_ID,
//       condition: `${apps.companyDirectory.fieldCode.status} in ("Active")`
//     });
//   },
//   getWorkingShift: async (arrOfEmployeeIdForAbid) => {
//     const condition = `${tableEmployeeWorkingShiftRef.columns.employeeId} in (${arrOfEmployeeIdForAbid.map(item => `"${item}"`).join(',')}) or
//       ${apps.workingShiftManagement.fieldCode.default} in ("Yes")
//     `;

//     return clientWorkingShiftManagement.record.getAllRecords({
//       app: process.env.WORKING_SHIFT_MANAGEMENT_APP_ID,
//       condition,
//     });
//   },
//   getNotificationTime: async () => {
//     const condition = `${apps.notificationTimeManagement.fieldCode.typeReminder} in ("Reminder Clock In/Out")`;

//     return clientNotificationTimeManagement.record.getAllRecords({
//       app: process.env.NOTIFICATION_TIME_MANAGEMENT_APP_ID,
//       condition,
//     });
//   },
//   mapUserData: (users, workingShifts, defaultWorkingShift, reminderTimeRec, currentdDt) => {
//     const currentDateOnly = currentdDt.toFormat('yyyy-MM-dd');
//     const midnightDtDummy = dt.fromFormat(`${currentDateOnly} 00:00`, 'yyyy-MM-dd HH:mm');

//     const initDt = dt.now();
//     const [reminderTimeRecord] = reminderTimeRec;
//     const notificationTime = parseInt(reminderTimeRecord[apps.notificationTimeManagement.fieldCode.notificationTime].value, 10) * 1000;

//     return users.map(item => {
//       const findShift = workingShifts.find(workRec => {
//         const tableShift = workRec[tableEmployeeWorkingShiftRef.code].value;

//         return tableShift.find(row =>
//           row.value[tableEmployeeWorkingShiftRef.columns.employeeId].value ===
//             item[apps.companyDirectory.fieldCode.employeeIdForAbid].value
//         );
//       });

//       const startTime = findShift ?
//         findShift[apps.workingShiftManagement.fieldCode.startTime].value :
//         defaultWorkingShift[apps.workingShiftManagement.fieldCode.startTime].value;
//       const endTime = findShift ?
//         findShift[apps.workingShiftManagement.fieldCode.endTime].value :
//         defaultWorkingShift[apps.workingShiftManagement.fieldCode.endTime].value;

//       const startLx = dt.fromFormat(`${currentDateOnly} ${startTime}`, 'yyyy-MM-dd HH:mm');
//       const endLx = dt.fromFormat(`${currentDateOnly} ${endTime}`, 'yyyy-MM-dd HH:mm');

//       const diffToStartTime = startLx.diff(initDt).toObject();
//       const diffToEndTime = endLx.diff(initDt).toObject();
//       const diffToStartTimeWithDelay = diffToStartTime.milliseconds - notificationTime;
//       const diffToEndTimeWithDelay = diffToEndTime.milliseconds - notificationTime;
//       const diffToStartTimeRdbl = startLx.diff(initDt, ['hours', 'minutes']).toObject();
//       const diffToEndTimeRdbl = endLx.diff(initDt, ['hours', 'minutes']).toObject();

//       const mapped = {
//         name: item[apps.companyDirectory.fieldCode.employeeName].value,
//         employeeIdForAbid: item[apps.companyDirectory.fieldCode.employeeIdForAbid].value,
//         scheduleDelay: [
//           {type: 'clockin', time: diffToStartTimeWithDelay},
//           {type: 'clockout', time: diffToEndTimeWithDelay}
//         ],
//         notificationTime,
//         pushNotifToken: item[apps.companyDirectory.fieldCode.notificationToken].value,
//       };

//       return mapped;
//     });
//   },
//   sendPushNotif: (userData, schedule) => {
//     const {
//       name: employeeName,
//     } = userData;
//     // console.log(util.inspect(userData, {depth: null}));

//     const clockType = schedule.type;
//     const delay = schedule.time;

//     const headers = {
//       // eslint-disable-next-line max-len
//       'Authorization': 'key=AAAAg46oVTM:APA91bEaNeKdoY9dQ7cZIZ_cGEDX2pqhEfagvTE_WpI1DrZ-qzdjdwIVR57BGE87Oi8FGQxEdv0zQ3cWmDeRx2ulXOha1NIxzp1e5Tikh2MElE4bVrkuqz-WKtlwQLk3pCko8xKyNhb5',
//       'Content-Type': 'application/json'
//     };

//     const notificationTimeRaw = userData.notificationTime;
//     const notifTimeSeconds = notificationTimeRaw / 1000;
//     const notifTimeMinutesQuotient = Math.floor(notifTimeSeconds / 60) || '';
//     const notifSeconds = notifTimeSeconds % 60 || '';

//     const minuteText = notifTimeMinutesQuotient ? ' minute(s)' : '';
//     const secondsText = notifSeconds ? ' second(s)' : '';

//     const bodyMessage = `
//       Hi ${employeeName}! Please don't forget to ${clockType} in  ${notifTimeMinutesQuotient} ${minuteText} ${notifSeconds} ${secondsText}.
//     `;

//     const body = {
//       'to': userData.pushNotifToken,
//       'notification': {
//         'body': bodyMessage,
//         'title': `Azbil Reminder (${clockType})!`,
//         // 'subtitle': `${clockType} reminder.`,
//       },
//       // 'data': {
//       //   'Record_number': idClockin,
//       //   'status': statusApproval,
//       // },
//     };

//     // functions.log({body});

//     return axios({
//       method: 'post',
//       url: process.env.FCM_BASE_URL + '/fcm/send',
//       headers,
//       data: body,
//     });
//   },
//   scheduleNotif: (userData, schedule) => {
//     setTimeout(() => {
//       functions.sendPushNotif(userData, schedule).then(resp => {
//         // console.log({resp});
//         // functions.log({resp: resp.data, related: {userData, schedule}});
//       }).catch(err => {
//         logger.error({err});
//         console.log({err});
//       });
//     }, schedule.time);
//   }
// };