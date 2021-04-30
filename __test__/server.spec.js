
/*jshint esversion:8*/
//import { validateTodaysDateWith } from "../src/server/server";
import 'regenerator-runtime/runtime';

/**
 * @jest-environment jsdom
 */


const request = require('supertest');
const app = require('../src/server/server');

describe('Post Endpoints', () => {
  it('Testing test route', async () => {
    const res = await request(app)
      .get('/test')
      .expect( data => {
        console.log('Hi I am a test');
        console.log('type:',data.type);
      })
      .expect(200)
      //.expect('hello world')
      .then(response => {
        console.log('-->body:', response.body);
        return response;
      })
      .then(response => {
        console.log('text:',response.text);
        console.log('header:',response.header);
      });
    //console.log('json:',res.body.json());
      //.expect(res.statusCode).toEqual(200);
    //console.log('body:',res.body);
    //console.log('status:',res.status);
    //expect(res.body).toHaveProperty('hello');
    //expect(res.body).toBe('hello');
  });
});
