import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/", async (req, res) => {
  res.send("Welcome to my game-studio!");
});

// Endpoint: GET /players-scores 
app.get("/players-scores", async (req, res) => {
  try {
    const sqlQuery = `
            SELECT players.name AS player_name, games.title AS game_title, scores.score
            FROM scores
            INNER JOIN players ON scores.player_id = players.id
            INNER JOIN games ON scores.game_id = games.id;
        `;
    const result = await pool.query(sqlQuery);
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Task 2: Find High Scorers 
app.get("/top-players", async (req, res) => {
  try {
    const sqlQuery = `
                SELECT
                    players.name AS player_name,
                    SUM(scores.score) AS total_score
                FROM scores
                INNER JOIN players ON scores.player_id = players.id
                GROUP BY players.id
                ORDER BY total_score DESC
                LIMIT 3`;
    const result = await pool.query(sqlQuery);
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Task 3: Players Who Didn’t Play Any Games 

app.get("/inactive-players", async (req, res) => {
  try {
    const query = `SELECT * 
            FROM players
            LEFT OUTER JOIN scores ON players.id = scores.player_id
            WHERE scores.player_id IS NULL;`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Task 5: Recently Joined Players 
app.get("/recent-players", async (req, res) => {
  try {
    const query = `SELECT name, join_date
            FROM players
            WHERE join_date >= NOW() - INTERVAL '30 day'
            ORDER BY join_date DESC;`;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Bonus Task: Players' Favorite Games 
// I did not get all the way, I get all the number of plays for each game, 
// but I could not figure out how to get the most played game for each player.
app.get("/favorite-games", async (req, res) => {
  try {
    const query = `
            SELECT 
            players.name AS player_name,
            games.title AS favorite_game,
            COUNT(scores.game_id) AS number_of_plays
            FROM scores
            INNER JOIN players ON scores.player_id = players.id
            INNER JOIN games ON scores.game_id = games.id
            GROUP BY players.id, games.id
            ORDER BY players.id, number_of_plays DESC
        `;
    const result = await pool.query(query);
    res.json(result.rows);

  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(4200, () => {
  console.log("Server is running on port 4200");
});
