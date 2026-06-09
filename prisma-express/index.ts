import express from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const app = express();
app.use(express.json());

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

app.get("/userlanguages", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    if(error instanceof Error) {
      console.error("Oh no! I failed to fetch users:", error.message);
       res.status(500).json({ error: "Oh no! I failed to fetch users" });
    } else {
      console.error("Oh no! I failed to fetch users due to an unknown error:", error);
      res.status(500).json({ error: "Oh no! I failed to fetch users due to an unknown error" });
    }
   
  }
});

app.post("/userlanguages", async (req, res) => {
  try {
    const { name, email, languages, age } = req.body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        languages,
        age,
      },
    });
    res.status(201).json(newUser);
    
  } catch (error) {
    if(error instanceof Error) {
      console.error(":( I failed to create a user:", error.message);
      res.status(500).json({ error: ":( I failed to create a user" });
    } else {
      console.error(":( I failed to create a user due to an unknown error:", error);
      res.status(500).json({ error: ":( I failed to create a user due to an unknown error" });
    }
  }
});
app.put("/userlanguages/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { languages } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        languages,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    if(error instanceof Error) {
      console.error("Oops, I failed to update a user:", error.message);
      res.status(500).json({ error: "Oops, I failed to update a user" });
    } else {
      console.error("Oops, I failed to update a user due to an unknown error:", error);
      res.status(500).json({ error: "Oops, I failed to update a user due to an unknown error" });
    }
  }
});

app.delete("/userlanguages", async (_req, res) => {
  try {
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        age: {
          lt: 18,
        },
      },
    });

    res.json({ deletedUsers: deletedUsers.count });
  } catch (error) {
    if(error instanceof Error) {
      console.error("Oops, I failed to delete users under 18:", error.message);
      res.status(500).json({ error: "Oops, I failed to delete users under 18" });
    } else {
      console.error("Oops, I failed to delete users under 18 due to an unknown error:", error);
      res.status(500).json({ error: "Oops, I failed to delete users under 18 due to an unknown error" });
    }
  }
});


app.get("/userlanguages/:language", async (req, res) => {
  try {
    const { language } = req.params;
    const users = await prisma.$queryRaw`
      SELECT *
      FROM "User"
      WHERE EXISTS (
        SELECT 1
        FROM unnest("languages") AS language
        WHERE lower(language) = lower(${language})
      )
    `;

    res.json(users);
  } catch (error) {
    if(error instanceof Error) {
      console.error("Oh no! I failed to fetch users by language:", error.message);
      res.status(500).json({ error: "Oh no! I failed to fetch users by language" });
    } else {
      console.error("Oh no! I failed to fetch users by language due to an unknown error:", error);
      res.status(500).json({ error: "Oh no! I failed to fetch users by language due to an unknown error" });
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});