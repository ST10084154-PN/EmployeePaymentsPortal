const request = require('supertest');
const app = require('../server');
describe('Auth endpoints', () => {
  it('should reject invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noone@example.com', password: 'badpass' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
