
/*jshint esversion:8*/
import { createJSONDateStatsFromUserInputDate } from "../src/client/js/informationcardlogic";
import { getFutureDateFrom } from "../src/client/js/datelogic.js";
import 'regenerator-runtime/runtime';

jest.clearAllMocks();

describe("Test Weather Query Type", () => {

    // Given:

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

        // Existence
        expect(createJSONDateStatsFromUserInputDate).toBeDefined();
        
        // When: Travel date is 16 days ahead
        document.body.outerHTML = `<input type="date" id="travDay"  value="2021-06-09">`;
        // Then: Show CLIMATE
        let result = createJSONDateStatsFromUserInputDate(todaysDate, document.getElementById('travDay'), true)
        expect(result.typeOfWeathercast == CLIMATE).toBeTruthy();
        
        
        // When: A Travel date of today is entered
        document.body.outerHTML = `<input type="date" id="travDay" value="2021-05-24">`; 
        // Then: show CURRENT
        result = createJSONDateStatsFromUserInputDate(todaysDate, document.getElementById('travDay'), true)
        expect(result.typeOfWeathercast == CURRENT).toBeTruthy();
        

        // When: A date of tomorrow is provided
        document.body.outerHTML = `<input type="date" id="travDay" value="2021-05-25">`; 
        // Then: Then show FORECAST 
        result = createJSONDateStatsFromUserInputDate(todaysDate, document.getElementById('travDay'), true)
        expect(result.typeOfWeathercast == FORECAST).toBeTruthy();
    });

});