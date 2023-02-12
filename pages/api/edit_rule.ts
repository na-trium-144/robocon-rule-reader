import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Rule, ApiReturnMsg } from "lib/types";

export default function editRule(req: NextApiRequest, res: NextApiResponse) {
  void (async (req, res) => {
    const data = req.body as Rule;
    let status = 200;
    const ret: ApiReturnMsg = { ok: true, msg: "" };
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
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          status = 400;
          ret.ok = false;
          ret.msg = "ルール番号が重複しています";
        } else {
          status = 500;
          ret.ok = false;
          ret.msg = "サーバーエラー";
          console.log(err);
        }
      });
    await prisma.$disconnect();
    res.status(status).json(ret);
  })(req, res);
}
