import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Rule } from "lib/types";

export default function editRule(req: NextApiRequest, res: NextApiResponse<>) {
  void (async (req, res) => {
    const data = req.body as Rule;
    let status = 200;
    let msg = "";
    const rule: Rule = await prisma.rule
      .create({
        data: {
          num: data.num,
          text: data.text,
        },
      })
      .catch((err) => {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          status = 400;
          msg = "Unique constraint failed";
        }else{
          status = 500;
          console.log(err);
        }
      })
      .finally(
        void (async () => {
          await prisma.$disconnect();
        })
      );
    for (const c of data.comments) {
      if (status === 500) {
        break;
      }
      await prisma.comment
        .create({
          data: {
            text: c.text,
            rule: {
              connect: {
                id: rule.id,
              },
            },
            category: {
              connectOrCreate: {
                where: {
                  name: c.category.name,
                },
                create: {
                  name: c.category.name,
                },
              },
            },
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
    }
    res.status(status).json({msg: msg});
  })(req, res);
}
