
/*jshint esversion:8*/
import { validateTodaysDateWith } from "../src/client/js/buttonpress";
//import { getFutureDateFrom } from '../src/client/js/informationcardlogic';
import 'regenerator-runtime/runtime';

describe("buttonpress datelogic tests", () => {

  // Given: A basic HTML DOM
  document.body.outerHTML = '<div id="travelDayWarning">warning</div>';
  //document.getElementById('travelDayWarning').style.visibility = 'visible';
  function getFutureDateFrom(date, daysAhead) {
    return new Date(date.getTime() +  (daysAhead * 24 * 60 * 60 * 1000));
  }

  function dateDifference(startDate, endDate) {
    let millisecondDiff = endDate - startDate;
    let days = Math.ceil(millisecondDiff / (24*60*60*1000));
    console.log(`${days} away`);
    return days;
  }

  // When:
	test("validateTodaysDateWith Travel Date function with todays date", () => {
    // Then:
    expect(validateTodaysDateWith).toBeDefined();
    expect(validateTodaysDateWith(new Date(Date.now()))).toBeTruthy();
    expect(validateTodaysDateWith(getFutureDateFrom(new Date(Date.now()),-2))).toBeFalsy();
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
