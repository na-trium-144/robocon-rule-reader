import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Book, ApiReturnMsg } from "lib/types";

export const editBook = async (book: Book) => {
  const ret: ApiReturnMsg = { status: 200, ok: true, msg: "" };
  await prisma.book
    .update({
      where: {
        id: book.id,
      },
      data: {
        name: book.name,
      },
    })
    .catch((err) => {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        ret.status = 400;
        ret.ok = false;
        ret.msg = "ルールブック名が重複しています";
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
    const data = req.body as Book;
    const ret = await editBook(data);
    await prisma.$disconnect();
    res.status(ret.status).json(ret);
  })(req, res);
}
