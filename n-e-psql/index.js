import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const app = express();
const envSchema = z.object({
  DB_USER: z.string(),
  DB_HOST: z.string(),
  DB_NAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.string().optional(),
});

const validatedEnv = envSchema.safeParse(process.env);

if (!validatedEnv.success) {
  console.error("Invalid environment variables:", z.treeifyError(validatedEnv.error));
  process.exit(1);
}
const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = validatedEnv.data;
const pool = new pg.Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
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
    if(error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
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
    if(error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
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
    if(error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
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
    if(error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
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
    if(error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
});

app.listen(4200, () => {
  console.log("Server is running on port 4200");
});
