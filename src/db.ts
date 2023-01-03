import { PrismaClient } from "@prisma/client";

type DBCallback = (prisma: PrismaClient) => Promise<unknown>;

//  Initiate a client
const prisma = new PrismaClient();

export const db = (callback: DBCallback) => {
  return callback(prisma)
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
};
