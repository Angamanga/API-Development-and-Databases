import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function seed() {
  try {
    await prisma.user.createMany({
      data: [
        {
          name: "Astrid",
          email: "astrid@example.com",
          languages: ["Swedish", "English"],
          age: 28
        },
        {
          name: "Lars",
          email: "lars@example.com",
          languages: ["Swedish", "German"],
          age: 34
        },
        {
          name: "Ingrid",
          email: "ingrid@example.com",
          languages: ["Swedish", "French"],
          age: 25
        },
        {
          name: "Björn",
          email: "bjorn@example.com",
          languages: ["Swedish", "English"],
          age: 41
        },
        {
          name: "Karin",
          email: "karin@example.com",
          languages: ["Swedish", "Norwegian"],
          age: 31
        },
        {
          name: "Erik",
          email: "erik@example.com",
          languages: ["Swedish", "Danish"],
          age: 29
        },
        {
          name: "Maja",
          email: "maja@example.com",
          languages: ["Swedish", "English"],
          age: 22
        },
        {
          name: "Olof",
          email: "olof@example.com",
          languages: ["Swedish", "Finnish"],
          age: 37
        },
        {
          name: "Sofia",
          email: "sofia@example.com",
          languages: ["Swedish", "Spanish"],
          age: 27
        },
        {
          name: "Nils",
          email: "nils@example.com",
          languages: ["Swedish", "English"],
          age: 33
        }
      ]
    });
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Fatal seed error:", error);
    await prisma.$disconnect();
    throw error;
  });