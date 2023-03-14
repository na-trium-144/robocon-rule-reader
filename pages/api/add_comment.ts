import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Comment, ApiReturnMsg } from "lib/types";

export const addComment = async (c: Comment) => {
  const ret: ApiReturnMsg = { status: 200, ok: true, msg: "" };
  let newOrder = 0;
  const comments = await prisma.comment.findMany({
    select: { order: true },
    where: { category: { name: c.category.name } },
    orderBy: { order: "desc" },
  });
  if (comments.length >= 1) {
    newOrder = comments[0].order + 1;
  }
  await prisma.comment
    .create({
      data: {
        text: c.text,
        rule: {
          connect: {
            id: c.ruleId,
          },
        },
        order: newOrder,
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
      ret.status = 500;
      ret.ok = false;
      ret.msg = "サーバーエラー";
      console.log(err);
    });
  return ret;
};
export default function addCommentRouter(
  req: NextApiRequest,
  res: NextApiResponse<ApiReturnMsg>
) {
  void (async (req, res) => {
    const data = req.body as Comment;
    const ret = await addComment(data);
    await prisma.$disconnect();
    res.status(ret.status).json(ret);
  })(req, res);
}
