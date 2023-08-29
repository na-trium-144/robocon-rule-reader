import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { bookInclude } from "lib/types";

export default function fetchBooks(req: NextApiRequest, res: NextApiResponse) {
  void (async (req, res) => {
    let status = 200;
    const data = await prisma.book
      .findMany({
        include: bookInclude,
      })
      .catch((err) => {
        status = 500;
        console.log(err);
      });
    await prisma.$disconnect();
    res.status(status).json(data || []);
  })(req, res);
}
