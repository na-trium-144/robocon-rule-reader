import { Prisma } from "@prisma/client";

export const bookInclude = Prisma.validator<Prisma.BookInclude>()({
  /*rules: {
    include: {
      comments: {
        include:{
          category: true,
        }
      }
    },
  },*/
});
const book = Prisma.validator<Prisma.BookArgs>()({ include: bookInclude });
export type Book = Prisma.BookGetPayload<typeof book>;
export type BookInfo = Book & { rulesNum: number; commentsNum: number };

export const ruleInclude = Prisma.validator<Prisma.RuleInclude>()({
  comments: {
    include: {
      category: true,
    },
  },
});
const rule = Prisma.validator<Prisma.RuleArgs>()({ include: ruleInclude });
export type Rule = Prisma.RuleGetPayload<typeof rule>;

export const categoryInclude = Prisma.validator<Prisma.CategoryInclude>()({
  comments: {
    include: {
      rule: true,
    },
    orderBy: {
      order: "asc",
    },
  },
});
const category = Prisma.validator<Prisma.CategoryArgs>()({
  include: categoryInclude,
});
export type Category = Prisma.CategoryGetPayload<typeof category>;

export const commentInclude = Prisma.validator<Prisma.CommentInclude>()({
  category: true,
  rule: true,
});
const comment = Prisma.validator<Prisma.CommentArgs>()({
  include: commentInclude,
});
export type Comment = Prisma.CommentGetPayload<typeof comment>;

export interface ApiReturnMsg {
  status: number;
  ok: boolean;
  msg: string;
}

export type CommentCreate = Comment & { bookId: number };
