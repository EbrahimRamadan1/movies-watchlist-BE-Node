import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["error", "query", "warn"]
      : ["error"],
});

const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected via PRISMA");
  } catch (error) {
    console.log(`DB connection error: ${error.message}`);
    process.exit(1);
  }
};
const disConnectDb = async () => {
  await prisma.$disconnect();
};

export { connectDb, disConnectDb, prisma };
