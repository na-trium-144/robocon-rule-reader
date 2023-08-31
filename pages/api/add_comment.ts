import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Comment, CommentCreate, ApiReturnMsg } from "lib/types";

export const connectOrCreateCategory = async (
  categoryName: string,
  bookId: number
) => {
  const existingCategory = await prisma.category.findMany({
    select: { id: true },
    where: {
      AND: {
        name: categoryName,
        bookId: bookId,
      },
    },
  });
  const categories = await prisma.category.findMany({
    select: { order: true },
    where: { bookId: bookId },
    orderBy: { order: "desc" },
  });
  let newCategoryOrder = 0;
  if (categories.length > 1) {
    newCategoryOrder = categories[0].order;
  }
  return {
    where: {
      id: existingCategory[0] != null ? existingCategory[0].id : -1,
    },
    create: {
      name: categoryName,
      book: {
        connect: {
          id: bookId,
        },
      },
      order: newCategoryOrder,
    },
  };
};
export const addComment = async (c: CommentCreate) => {
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
          connectOrCreate: await connectOrCreateCategory(c.category.name, c.bookId),
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
