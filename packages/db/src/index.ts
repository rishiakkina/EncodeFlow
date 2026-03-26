import { Prisma, PrismaClient } from "./generated/prisma/client.js";
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
const databaseUrl = process.env.DATABASE_URL;


const client = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: databaseUrl }),
});
export default client;
export type { Prisma };