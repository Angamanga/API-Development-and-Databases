import express from 'express';
import {z } from 'zod';
const app = express();
const port = 3000;


const randomPersonSchema = z.object({
  fullName: z.string().min(3).max(30),
  country: z.string().min(2).max(100)
});
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/random-person', async (req, res) => {
  const response = await fetch('https://randomuser.me/api/');
  const data = await response.json();
  const randomPerson = {
    fullName: `${data.results[0].name.first} ${data.results[0].name.last}`,
    country: data.results[0].location.country
  };  

  const validatedPerson = randomPersonSchema.safeParse(randomPerson);
  if (!validatedPerson.success) {
    res.status(400).json({error: z.treeifyError(validatedPerson.error)});
    return;
  }
  res.json(validatedPerson.data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
