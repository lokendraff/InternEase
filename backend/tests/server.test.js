const request = require('supertest');
const app = require('../server');

describe('Server Basics', () => {
  it('should return 200 on the test route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('InternEase API is running...');
  });
});
