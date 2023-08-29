import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Book, ApiReturnMsg } from "lib/types";

export const deleteBook = async (book: Book) => {
  const ret: ApiReturnMsg = { status: 200, ok: true, msg: "" };
  await prisma.book
    .delete({
      where: {
        id: book.id,
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
export default function deleteBookRouter(
  req: NextApiRequest,
  res: NextApiResponse<ApiReturnMsg>
) {
  void (async (req, res) => {
    const data = req.body as Book;
    const ret = await deleteBook(data);
    await prisma.$disconnect();
    res.status(ret.status).json(ret);
  })(req, res);
}
