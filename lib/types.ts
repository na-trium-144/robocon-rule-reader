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

export const commentInclude = Prisma.validator<Prisma.CommentInclude>()({
  rule: true,
  category: true,
});
const comment = Prisma.validator<Prisma.CommentArgs>()({
  include: commentInclude,
});
export type Comment = Prisma.RuleGetPayload<typeof comment>;
