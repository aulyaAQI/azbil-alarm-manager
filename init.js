export const apps = {
  companyDirectory: {
    fieldCode: {
      status: 'Drop_down',
      employeeIdForAbid: 'Employee_ID_Number',
      employeeName: 'Text',
      userDataInKintone: 'User_selection',
      notificationToken: 'token_notifications',
    }
  },
  workingShiftManagement: {
    fieldCode: {
      shiftType: 'shift_type',
      startTime: 'start_time',
      endTime: 'end_time',
      default: 'Check_box',
      table: {
        employeeData: {
          code: 'employee_data',
          columns: {
            employeeId: 'employee_id',
            employeeName: 'employee_name',
          }
        }
      }
    }
  },
  notificationTimeManagement: {
    fieldCode: {
      notificationTime: 'notification_time',
      interval: 'interval',
      typeReminder: 'type_reminder',
      repeatNotification: 'repeat_notification',
    }
  },
  attendanceReport: {

  }
};