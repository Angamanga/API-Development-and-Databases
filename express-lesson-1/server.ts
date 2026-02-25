import express from 'express';

const app = express();
app.use(express.json());
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to our API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ];
  res.json(users);
});

app.post('/users', (req, res) => {
  const newUser = req.body;
  console.log(`New user created: ${newUser}`);
  res.json({ message: 'User added successfully', user: newUser });
});
