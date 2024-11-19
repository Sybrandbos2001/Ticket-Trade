import axios from 'axios';

const baseURL = process.env.API_URL || 'http://localhost:3000';

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get(`${baseURL}/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});