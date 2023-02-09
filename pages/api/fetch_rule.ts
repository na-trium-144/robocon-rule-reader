import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Rule, ruleInclude } from "lib/types";

export default function fetchRules(
  req: NextApiRequest,
  res: NextApiResponse<Rule[]>
) {
  void (async (req, res) => {
    let status = 200;
    const data: Rule[] = await prisma.rule
      .findMany({
        include: ruleInclude
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