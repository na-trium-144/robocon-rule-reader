import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from "@prisma/client";
import { Category, ApiReturnMsg } from "lib/types";

export const editCategory = async (c: Category) => {
  const ret: ApiReturnMsg = { status: 200, ok: true, msg: "" };
  await prisma.category
    .update({
      where: {
        id: c.id,
      },
      data: {
        name: c.name,
        order: c.order,
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
export default function editCategoryRouter(
  req: NextApiRequest,
  res: NextApiResponse<ApiReturnMsg>
) {
  void (async (req, res) => {
    const data = req.body as Category;
    const ret = await editCategory(data);
    await prisma.$disconnect();
    res.status(ret.status).json(ret);
  })(req, res);
}
