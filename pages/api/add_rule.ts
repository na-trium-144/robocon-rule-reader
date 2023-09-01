import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Rule, ApiReturnMsg } from "lib/types";
import { addComment } from "./add_comment";

export const addRule = async (rule: Rule) => {
  const ret: ApiReturnMsg = { status: 200, ok: true, msg: "" };
  const retRule = await prisma.rule
    .create({
      data: {
        num: rule.num,
        title: rule.title,
        text: rule.text,
        textTrans: rule.textTrans,
        book: {
          connect: {
            id: rule.bookId,
          },
        },
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
  return [retRule, ret];
};
export default function addRuleRouter(
  req: NextApiRequest,
  res: NextApiResponse<ApiReturnMsg>
) {
  void (async (req, res) => {
    const data = req.body as Rule;
    let ret: ApiReturnMsg;
    const [retRule, ret1] = await addRule(data);
    ret = ret1 as ApiReturnMsg;
    if (ret.ok) {
      for (const c of data.comments) {
        ret = await addComment({
          ...c,
          ruleId: (retRule as Rule).id,
          rule: retRule as Rule,
          bookId: data.bookId,
        });
      }
    }
    await prisma.$disconnect();
    res.status(ret.status).json(ret);
  })(req, res);
}
