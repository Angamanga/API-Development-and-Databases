import express from 'express';

type Recipe = {
  id: number;
  name: string;
  cuisine: string;
  prepTime: number;
};

const app = express();
const port = 3000;

app.use(express.json());

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

// Getting all recipes
app.get('/recipes', (req, res) => {
  res.json(recipes);
});

// Getting a recipe by ID
app.get('/recipes/:id', (req, res) => {
  const recipeId = Number(req.params.id);
  const recipe = recipes.find((item) => item.id === recipeId);
  
  if (!recipe) {
    return res.status(404).json({ message: 'Oh no, the recipe was not found!' });
  }

  res.json(recipe);
});

// Add a new recipe
app.post('/recipes', (req, res) => {
  const { name, cuisine, prepTime } = req.body;

  const newRecipe: Recipe = {
    id: recipes.length + 1,
    name,
    cuisine,
    prepTime
  };

  recipes.push(newRecipe);

  res.status(201).json({
    message: 'Recipe created successfully',
    recipe: newRecipe
  });
});

// Update a recipe by ID
app.put('/recipes/:id', (req, res) => {
  const recipeId = Number(req.params.id);
  const recipe = recipes.find((item) => item.id === recipeId);

  if (!recipe) {
    return res.status(404).json({ message: 'Oh no, the recipe you want to update was not found! Check the ID again!' });
  }

  const { name, cuisine, prepTime } = req.body;

  recipe.name = name || recipe.name;
  recipe.cuisine = cuisine || recipe.cuisine;
  recipe.prepTime = prepTime || recipe.prepTime;

  res.json({
    message: 'Yay, recipe updated successfully',
    recipe
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
