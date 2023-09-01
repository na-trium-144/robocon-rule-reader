import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { bookInclude, bookInclude2 } from "lib/types";

export default function fetchBooks(req: NextApiRequest, res: NextApiResponse) {
  void (async (req, res) => {
    let status = 200;
    const data = await prisma.book
      .findMany({
        include: bookInclude,
        orderBy: {
          name: "asc",
        },
      })
      .catch((err) => {
        status = 500;
        console.log(err);
      });
    const dataInfo = await Promise.all(
      data?.map(async (b) => ({
        ...b,
        rulesNum: (
          await prisma.rule.findMany({
            select: { id: true },
            where: { bookId: b.id },
          })
        ).length,
        commentsNum: (
          await prisma.comment.findMany({
            select: { id: true },
            where: {
              category: {
                bookId: b.id,
              },
            },
          })
        ).length,
      }))
    );
    await prisma.$disconnect();
    res.status(status).json(dataInfo || []);
  })(req, res);
}
