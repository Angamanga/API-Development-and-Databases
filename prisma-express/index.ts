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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});