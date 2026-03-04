import express from 'express';

type Recipe = {
  id: number;
  name: string;
  cuisine: string;
  prepTime: number;
};

const app = express();
const port = 3000;

const recipes: Recipe[] = [
  {
    id: 1,
    name: 'Smoothie',
    cuisine: 'International',
    prepTime: 20
  },
  {
    id: 2,
    name: 'Spaghetti Bolognese',
    cuisine: 'Italian',
    prepTime: 40
  },
  {
    id: 3,
    name: 'Greek Salad',
    cuisine: 'Greek',
    prepTime: 15
  },
  {
    id: 4,
    name: 'Palt',
    cuisine: 'Swedish',
    prepTime: 120
  }
];

app.get('/recipes', (req, res) => {
  res.json(recipes);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
