
/*jshint esversion:8*/
import { createJSONDateStatsFromUserInputDate } from "../src/client/js/informationcardlogic";
import { getFutureDateFrom, dateDifference } from "../src/client/js/datelogic.js";
import 'regenerator-runtime/runtime';

jest.clearAllMocks();

describe("Test Weather Query Type", () => {

    // GIVEN:

    const CURRENT = 'CURRENT';
    const FORECAST = 'FORECAST';
    const CLIMATE = 'CLIMATE';


    // Adjust dates in test so you can test what you want
    let todaysDate = new Date('2021-05-24 00:00:01');

    test("validateTodaysDateWith Travel Date function with various dates", () => {

        // EXISTENCE
        expect(createJSONDateStatsFromUserInputDate).toBeDefined();

        // WHEN: The entered date from date picker will always be midnight of the day
        document.body.outerHTML = `<input type="date" id="travDay" value="2021-05-24">`;
        // THEN: show CURRENT
        result = createJSONDateStatsFromUserInputDate(todaysDate, document.getElementById('travDay'), true)
        console.log('weather type',result.typeOfWeathercast);
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
        
        var startDate = new Date('2021-05-28');
        var endDate = new Date('2021-05-29');
        expect(dateDifference(startDate, endDate) == 1).toBeTruthy();

        var startDate = new Date('2021-05-28');
        var endDate = new Date('2021-05-30');
        expect(dateDifference(startDate, endDate) == 2).toBeTruthy();

        var startDate = new Date('2021-05-28');
        var endDate = new Date('2021-06-07');
        expect(dateDifference(startDate, endDate) == 10).toBeTruthy();
    });

});