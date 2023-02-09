import { Prisma } from "@prisma/client";

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
    include:{
      rule: true,
    }
  }
});
const category = Prisma.validator<Prisma.CategoryArgs>()({
  include: categoryInclude,
});
export type Category = Prisma.RuleGetPayload<typeof category>;

export interface ApiReturnMsg{
  msg: string;
}