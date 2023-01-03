import type { NextApiHandler } from "next";
import { db } from "./../../db";

const handler: NextApiHandler = async (req, res) => {
  const { title, description } = req.body;
  await db(async (prisma) => {
    const newLesson = await prisma.lesson.create({
      data: {
        title,
        description,
      },
    });
    res.status(200).json({ lesson: newLesson });
  }).catch(() => {
    res.status(500);
  });
};

export default handler;
