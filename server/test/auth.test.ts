import request from 'supertest';
import { app } from '../index'; // Assuming your Express app is exported from index.ts

describe('Authentication Endpoints', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(response.status).toBe(201);
    expect(response.body.username).toBe('testuser');
  });

  it('should not allow duplicate usernames', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(response.status).toBe(400);
  });

  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });

  it('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });
    expect(response.status).toBe(401);
  });
});
