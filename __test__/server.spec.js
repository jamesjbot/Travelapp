
/*jshint esversion:8*/
import 'regenerator-runtime/runtime';

/**
 * @jest-environment jsdom
 */

jest.clearAllMocks();


const request = require('supertest');
const app = require('../src/server/server');

describe('Post User Data Endpoint', () => {
  it('Testing Post User Data route', async () => {
    let userdata = {place: 'NY, NY'};
    const res = await request(app)
      .post('/postUserData')
      .send(userdata)
      .expect(200);
  });
});
