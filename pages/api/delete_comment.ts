import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Comment, ApiReturnMsg } from "lib/types";

export const deleteComment = async (c: Comment) => {
  const ret: ApiReturnMsg = { status: 200, ok: true, msg: "" };
  await prisma.comment
    .delete({
      where: {
        id: c.id,
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
export default function deleteCommentRouter(
  req: NextApiRequest,
  res: NextApiResponse<ApiReturnMsg>
) {
  void (async (req, res) => {
    const data = req.body as Comment;
    const ret = await deleteComment(data);
    await prisma.$disconnect();
    res.status(ret.status).json(ret);
  })(req, res);
}
