import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Category, categoryInclude } from "lib/types";

export default function fetchCategories(
  req: NextApiRequest,
  res: NextApiResponse
) {
  void (async (req, res) => {
    let status = 200;
    const data = await prisma.category
      .findMany({
        include: categoryInclude,
      })
      .catch((err) => {
        status = 500;
        console.log(err);
      });
    await prisma.$disconnect();
    res.status(status).json(data || []);
  })(req, res);
}
