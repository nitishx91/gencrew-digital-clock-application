import express from 'express';
import { Pool } from 'pg';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = new Redis(process.env.REDIS_URL);

const SECRET_KEY = process.env.SECRET_KEY;

app.get('/time', async (req, res) => {
  try {
    const cacheKey = 'current_time';
    const cachedTime = await redis.get(cacheKey);

    if (cachedTime) {
      return res.json({ time: cachedTime });
    }

    const { rows } = await pool.query('SELECT NOW() AS time');
    const currentTime = rows[0].time;

    await redis.set(cacheKey, currentTime, 'EX', 60);

    res.json({ time: currentTime });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (rows.length === 0 || rows[0].password!== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/auth/validate', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ valid: true });
  } catch (error) {
    res.json({ valid: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});