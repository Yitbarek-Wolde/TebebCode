import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/run', async (req, res) => {
  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: '89dc6bafb0ec5274d82f70a707ed42c6',
      clientSecret: 'f1ee416a9609a8cb7dcd7724616a9c950c8c55a24abe720c1028a1ddc6950cee',
      ...req.body,
    });
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => {
  console.log('Proxy running at http://localhost:4000');
});
