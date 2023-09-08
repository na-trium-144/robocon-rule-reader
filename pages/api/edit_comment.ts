import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { CommentCreate, ApiReturnMsg } from "lib/types";
import { connectOrCreateCategory } from "./add_comment";
import { deleteEmptyCategories} from "./delete_comment";

export const editComment = async (c: CommentCreate) => {
  const ret: ApiReturnMsg = { status: 200, ok: true, msg: "" };
  await prisma.comment
    .update({
      where: {
        id: c.id,
      },
      data: {
        text: c.text,
        category:
          c.category == null
            ? undefined
            : {
                connectOrCreate: await connectOrCreateCategory(
                  c.category.name,
                  c.bookId
                ),
              },
        order: c.order,
        externalLink: c.externalLink,
        externalName: c.externalName,
      },
    })
    .catch((err) => {
      ret.status = 500;
      ret.ok = false;
      ret.msg = "サーバーエラー";
      console.log(err);
    });
  await deleteEmptyCategories();
  return ret;
};
export default function editCommentRouter(
  req: NextApiRequest,
  res: NextApiResponse<ApiReturnMsg>
) {
  void (async (req, res) => {
    const data = req.body as CommentCreate;
    const ret = await editComment(data);
    await prisma.$disconnect();
    res.status(ret.status).json(ret);
  })(req, res);
}
