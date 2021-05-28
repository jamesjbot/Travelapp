
/*jshint esversion:8*/
import { createJSONDateStatsFromUserInputDate } from "../src/client/js/informationcardlogic";
import { getFutureDateFrom, dateDifference } from "../src/client/js/datelogic.js";
import 'regenerator-runtime/runtime';

jest.clearAllMocks();

describe("Test Weather Query Type", () => {

    // GIVEN:

    // A mocked version of isDateSupported()
    // global.isDateSupported = jest.fn(() => {
    //     return true;
    // });

    const CURRENT = 'CURRENT';
    const FORECAST = 'FORECAST';
    const CLIMATE = 'CLIMATE';

    let todaysDate = new Date(Date.now());

    // Adjust dates in test so you can test what you want

    test("validateTodaysDateWith Travel Date function with various dates", () => {

        // EXISTENCE
        expect(createJSONDateStatsFromUserInputDate).toBeDefined();



        // WHEN: The entered date from date picker will always be midnight of the day
        let today = new Date('2021-05-25T00:00:01');
        
        document.body.outerHTML = `<input type="date" id="travDay" value="2021-05-24">`;
        // THEN: show CURRENT
        result = createJSONDateStatsFromUserInputDate(todaysDate, document.getElementById('travDay'), true)
        expect(result.typeOfWeathercast == CURRENT).toBeTruthy();



        // WHEN: A date of tomorrow is provided
        document.body.outerHTML = `<input type="date" id="travDay" value="2021-05-25">`;
        // THEN: Then show FORECAST 
        result = createJSONDateStatsFromUserInputDate(todaysDate, document.getElementById('travDay'), true)
        expect(result.typeOfWeathercast == FORECAST).toBeTruthy();



        // WHEN: Travel date is 16 days ahead
        document.body.outerHTML = `<input type="date" id="travDay"  value="2021-06-09">`;
        // THEN: Show CLIMATE
        let result = createJSONDateStatsFromUserInputDate(todaysDate, document.getElementById('travDay'), true)
        expect(result.typeOfWeathercast == CLIMATE).toBeTruthy();


    });

    test("testing date difference", () => {

        // EXISTENCE
        expect(dateDifference).toBeDefined();



        // WHEN: A Travel date of today is entered
        //document.body.outerHTML = `<input type="date" id="travDay" value="2021-05-24">`;
        let todaysDate = new Date();    
        // THEN: show CURRENT
        result = createJSONDateStatsFromUserInputDate(todaysDate, document.getElementById('travDay'), true)
        expect(result.typeOfWeathercast == CURRENT).toBeTruthy();



        // WHEN: A date of tomorrow is provided
        document.body.outerHTML = `<input type="date" id="travDay" value="2021-05-25">`;
        // THEN: Then show FORECAST 
        result = createJSONDateStatsFromUserInputDate(todaysDate, document.getElementById('travDay'), true)
        expect(result.typeOfWeathercast == FORECAST).toBeTruthy();



        // WHEN: Travel date is 16 days ahead
        document.body.outerHTML = `<input type="date" id="travDay"  value="2021-06-09">`;
        // THEN: Show CLIMATE
        let result = createJSONDateStatsFromUserInputDate(todaysDate, document.getElementById('travDay'), true)
        expect(result.typeOfWeathercast == CLIMATE).toBeTruthy();


    });

});