import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Rule, ApiReturnMsg } from "lib/types";

export const deleteRule = async (rule: Rule) => {
  const ret: ApiReturnMsg = { status: 200, ok: true, msg: "" };
  await prisma.rule
    .delete({
      where: {
        id: rule.id,
      },
    })
    .catch((err) => {
      ret.status = 500;
      ret.ok = false;
      ret.msg = "サーバーエラー";
      console.log(err);
    });
  return ret;
};
export default function deleteRuleRouter(
  req: NextApiRequest,
  res: NextApiResponse<ApiReturnMsg>
) {
  void (async (req, res) => {
    const data = req.body as Rule;
    const ret = await deleteRule(data);
    await prisma.$disconnect();
    res.status(ret.status).json(ret);
  })(req, res);
}
