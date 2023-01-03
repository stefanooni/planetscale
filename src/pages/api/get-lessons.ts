import type { NextApiHandler } from "next";
import { db } from "./../../db";

const handler: NextApiHandler = async (req, res) => {
  await db(async (prisma) => {
    const lessons = await prisma.lesson.findMany();
    res.status(200).json({ lessons });
  }).catch(() => {
    res.status(500);
  });
};

export default handler;
