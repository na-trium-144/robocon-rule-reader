import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Comment, commentInclude } from "lib/types";

export default function fetchComments(
  req: NextApiRequest,
  res: NextApiResponse<Comment[]>
) {
  void (async (req, res) => {
    let status = 200;
    const data: Comment[] = await prisma.comment
      .findMany({
        select: commentInclude,
      })
      .catch((err) => {
        status = 500;
        console.log(err);
      })
      .finally(
        void (async () => {
          await prisma.$disconnect();
        })
      );
    res.status(status).json(data);
  })(req, res);
}
