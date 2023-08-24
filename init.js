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
    fieldCode: {
      employeeId: 'employee_id',
      spotAttendace: 'spot_attendance',
      actualClockIn: 'clock_in_time',
      actualClockOutDate: 'actual_clock_out_date',
      actualClockOut: 'clock_out_time',
      lateDuration: 'late_duration',
      clockOutStatus: 'status_clock_out',
      attendanceCategory: 'attendance_category',
      table: {
        history: {
          code: 'location_history',
          columns: {
            time: 'time',
            realTime: 'real_time',
            statusLocationHistory: 'status_location_history',
            latitude: 'latitude',
            longitude: 'longitude',
            address: 'address',
          }
        }
      }
    }
  },
};