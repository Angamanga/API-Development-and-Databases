# PostgreSQL Advanced Queries & Relationships 

## Add tables:  

```
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    join_date DATE
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    genre VARCHAR(100)
);

CREATE TABLE scores (
    player_id INTEGER,
    game_id INTEGER,
    score INTEGER,
    date_played DATE,
    PRIMARY KEY (player_id, game_id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);
```

## Task 1: List all players and their scores

```
SELECT
    players.name AS player_name,
    games.title AS game_title,
    scores.score
FROM scores
INNER JOIN players ON scores.player_id = players.id
INNER JOIN games ON scores.game_id = games.id;
```

## Task 2: Find high scorers
```
SELECT
    players.name AS player_name,
    SUM(scores.score) AS total_score
FROM scores
INNER JOIN players ON scores.player_id = players.id
GROUP BY players.id
ORDER BY total_score DESC
LIMIT 3
;
```

## Task 3: Players who didn't play any games
```
SELECT *
FROM players
LEFT OUTER JOIN scores ON players.id = scores.player_id
WHERE scores.player_id IS NULL;
```

## Task 4: Find popular game genres
```
SELECT
    games.genre,
    COUNT(scores.player_id) AS times_played
FROM scores
INNER JOIN games ON scores.game_id = games.id
GROUP BY games.genre
ORDER BY times_played DESC;
```

## Task 5: Recently joined players
```
SELECT name, join_date
FROM players
WHERE join_date >= NOW() - INTERVAL '30 day'
ORDER BY join_date DESC;
```