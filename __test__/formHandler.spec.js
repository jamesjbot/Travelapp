
/*jshint esversion:8*/
import { generate } from "../src/client/js/index";
import 'regenerator-runtime/runtime';

describe("Form handler tests", () => {

	test("Check generate function", () => {
		expect(generate).toBeDefined();
	});

});
