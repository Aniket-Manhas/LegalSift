const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return 404 for root route', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(404);
    });
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '9876543210'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });
  });
});
