import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Rule, ApiReturnMsg } from "lib/types";

export const editRule = async (rule: Rule) => {
  const ret: ApiReturnMsg = { status: 200, ok: true, msg: "" };
  await prisma.rule
    .update({
      where: {
        id: rule.id,
      },
      data: {
        num: rule.num,
        text: rule.text,
      },
    })
    .catch((err) => {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        ret.status = 400;
        ret.ok = false;
        ret.msg = "ルール番号が重複しています";
      } else {
        ret.status = 500;
        ret.ok = false;
        ret.msg = "サーバーエラー";
        console.log(err);
      }
    });
  return ret;
};
export default function editRuleRouter(
  req: NextApiRequest,
  res: NextApiResponse<ApiReturnMsg>
) {
  void (async (req, res) => {
    const data = req.body as Rule;
    const ret = await editRule(data);
    await prisma.$disconnect();
    res.status(ret.status).json(ret);
  })(req, res);
}
