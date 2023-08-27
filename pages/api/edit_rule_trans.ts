import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Rule, ApiReturnMsg } from "lib/types";

export const editRuleTrans = async (rule: Rule) => {
  const ret: ApiReturnMsg = { status: 200, ok: true, msg: "" };
  await prisma.rule
    .update({
      where: {
        num: rule.num,
      },
      data: {
        textTrans: rule.textTrans || "",
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
export default function editRuleTransRouter(
  req: NextApiRequest,
  res: NextApiResponse<ApiReturnMsg>
) {
  void (async (req, res) => {
    const data = req.body as Rule;
    const ret = await editRuleTrans(data);
    await prisma.$disconnect();
    res.status(ret.status).json(ret);
  })(req, res);
}
