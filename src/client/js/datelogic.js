
/*jshint esversion:8*/


// Return the elapsed days between start and end dates
function dateDifference(startDate, endDate) {
  let millisecondDiff = endDate - startDate;
  let days = Math.ceil(millisecondDiff / (24*60*60*1000));
  return days;
}

function getFutureDateFrom(date, daysAhead) {
  return new Date(date.getTime() +  (daysAhead * 24 * 60 * 60 * 1000));
}

export { dateDifference, getFutureDateFrom };
