import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
});

console.log('env:', process.env.OPEN_AI_SECRET_KEY);
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from ChatBot!',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: '256x256',
    });

    const imageUrl = response.data.data[0].url;

    res.status(200).send({
      bot: imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong, ARGHH!!');
  }
});

app.listen(5000, () =>
  console.log('AI server started on http://localhost:5000')
);
