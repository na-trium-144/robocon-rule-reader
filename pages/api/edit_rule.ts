import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Rule } from "lib/types";

export default function editRule(req: NextApiRequest, res: NextApiResponse) {
  void (async (req, res) => {
    const data = req.body as Rule;
    let status = 204;
    await prisma.rule
      .update({
        where: {
          id: data.id,
        },
        data: {
          num: data.num,
          text: data.text,
        },
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
    res.status(status).send("");
  })(req, res);
}
