
/*jshint esversion:8*/
import { validateTodaysDateWith } from "../src/client/js/buttonpress";
import 'regenerator-runtime/runtime';

describe("buttonpress datelogic tests", () => {

  // Given: A basic HTML DOM
  document.body.outerHTML = '<div id="travelDayWarning">warning</div>';
  // And functions
  function getFutureDateFrom(date, daysAhead) {
    return new Date(date.getTime() +  (daysAhead * 24 * 60 * 60 * 1000));
  }

  function dateDifference(startDate, endDate) {
    let millisecondDiff = endDate - startDate;
    let days = Math.ceil(millisecondDiff / (24*60*60*1000));
    console.log(`${days} away`);
    return days;
  }

	test("validateTodaysDateWith Travel Date function with various dates", () => {

    expect(validateTodaysDateWith).toBeDefined();
    // When: today's date is entered
    // Then: It will be a valid date
    expect(validateTodaysDateWith(new Date(Date.now()))).toBeTruthy();
    // When: A date 2 days prior to today is entered
    // Then: This will be an invalid date
    expect(validateTodaysDateWith(getFutureDateFrom(new Date(Date.now()),-2))).toBeFalsy();
    // When: A date 16 days in the future is provided
    // Then: This will be a valid date
    expect(validateTodaysDateWith(getFutureDateFrom(new Date(Date.now()),16))).toBeTruthy();
	});

});

// describe("Form handler tests", () => {
//
// 	test("Check handleSubmit function", () => {
// 		expect(handleSubmit).toBeDefined();
// 	});
//
// 	test("Testing the handleSubmit() function", () => {
// 		expect(validateEntry("http://www.google.com")).toBeDefined();
// 	});
//
// 	test("Valid URL Checker",() => {
// 		expect(validateEntry("http://www.google.com")).toBeTruthy();
// 		expect(validateEntry("https://www.yahoo.com")).toBeTruthy();
// 		expect(validateEntry("blahblahblah")).toBeFalsy();
// 	});
//
// });
