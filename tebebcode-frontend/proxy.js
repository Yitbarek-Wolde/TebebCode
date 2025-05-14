import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/run', async (req, res) => {
  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: process.env.code_exe_client,
      clientSecret: process.env.code_exe_clientSec,
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
