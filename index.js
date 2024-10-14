function calculateTotalTarget(startDate, endDate, totalAnnualTarget, excludeDay = 5) {
    // Helper function to determine if a date is a valid working day
    function isWorkingDay(date) {
      const day = date.getDay();
      return day !== excludeDay; // Exclude the specified day (5 for Friday by default)
    }
  
    // Helper function to calculate total working days in a month
    function getWorkingDaysInMonth(year, month) {
      let workingDays = 0;
      let date = new Date(year, month, 1);
      while (date.getMonth() === month) {
        if (isWorkingDay(date)) {
          workingDays++;
        }
        date.setDate(date.getDate() + 1);
      }
      return workingDays;
    }
  
    // Helper function to calculate working days within a date range
    function getWorkingDaysInRange(start, end) {
      let workingDays = 0;
      let date = new Date(start);
      while (date <= end) {
        if (isWorkingDay(date)) {
          workingDays++;
        }
        date.setDate(date.getDate() + 1);
      }
      return workingDays;
    }
  
    // Helper function to distribute the target proportionally
    function distributeTarget(totalTarget, totalWorkingDays, monthlyWorkingDays) {
      return monthlyWorkingDays.map(days => (days / totalWorkingDays) * totalTarget);
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Initialize result arrays
    const daysExcludingFridays = [];
    const daysWorkedExcludingFridays = [];
    let totalWorkingDaysInRange = 0;
  
    // Iterate through each month in the range
    for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
      for (let month = (year === start.getFullYear() ? start.getMonth() : 0);
           month <= (year === end.getFullYear() ? end.getMonth() : 11); month++) {
  
        // Get the total working days in the month
        const totalWorkingDaysInMonth = getWorkingDaysInMonth(year, month);
        daysExcludingFridays.push(totalWorkingDaysInMonth);
  
        // Calculate actual working days for the portion of the month within the range
        let monthStart = new Date(year, month, 1);
        let monthEnd = new Date(year, month + 1, 0);
        if (year === start.getFullYear() && month === start.getMonth()) {
          monthStart = start;
        }
        if (year === end.getFullYear() && month === end.getMonth()) {
          monthEnd = end;
        }
  
        const workingDaysInRange = getWorkingDaysInRange(monthStart, monthEnd);
        daysWorkedExcludingFridays.push(workingDaysInRange);
        totalWorkingDaysInRange += workingDaysInRange;
      }
    }
  
    // Proportionally distribute the total target
    const monthlyTargets = distributeTarget(totalAnnualTarget, totalWorkingDaysInRange, daysWorkedExcludingFridays);
  
    // Return the result object
    return {
      daysExcludingFridays,
      daysWorkedExcludingFridays,
      monthlyTargets,
      totalTarget: monthlyTargets.reduce((sum, target) => sum + target, 0)
    };
  }
  
  // Example usage:
  console.log(calculateTotalTarget('2024-01-01', '2024-03-31', 5220));