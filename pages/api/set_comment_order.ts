import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Comment, ApiReturnMsg } from "lib/types";

export const setCommentOrder = async (c: Comment) => {
  const ret: ApiReturnMsg = { status: 200, ok: true, msg: "" };
  await prisma.comment
    .update({
      where:{
        id:c.id
      },
      data: {
        order: c.order
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
export default function setCommentOrderRouter(
  req: NextApiRequest,
  res: NextApiResponse<ApiReturnMsg>
) {
  void (async (req, res) => {
    const data = req.body as Comment;
    const ret = await setCommentOrder(data);
    await prisma.$disconnect();
    res.status(ret.status).json(ret);
  })(req, res);
}
