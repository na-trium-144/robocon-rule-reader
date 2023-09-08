import { Rule, Comment } from "lib/types";

const colorSelector = (l: string) => {
  if (l.startsWith("##")) {
    return "green";
  } else if (l.startsWith("#")) {
    return "brown";
  } else if (l.startsWith(">>")) {
    return "blue";
  } else if (l.startsWith(">")) {
    return "green";
  } else if (l.startsWith("@")) {
    return "orange";
  } else if (l.startsWith("-")) {
    return "inherit";
  } else {
    return "gray";
  }
};

interface ruleTextProps {
  title?: boolean;
  text?: boolean;
  textTrans?: boolean;
  comments?: boolean;
}
export const ruleText = (rule: Rule, props: ruleTextProps) => {
  let text = `#${rule.num}\n`;
  if (props.title && rule.title !== "") {
    text += `##${rule.title}\n`;
  }
  if (props.text) {
    text += rule.text
      .split("\n")
      .filter((l) => l.length > 0)
      .map((l) => `>${l}\n`)
      .join("");
  }
  if (props.textTrans) {
    text += rule.textTrans
      .split("\n")
      .filter((l) => l.length > 0)
      .map((l) => `>>${l}\n`)
      .join("");
  }
  if (props.comments) {
    let prevCategory = "";
    for (const c of rule.comments) {
      if (prevCategory !== c.category.name) {
        text += `@${c.category.name}\n`;
      }
      text += `-${c.text}\n`;
      prevCategory = c.category.name;
    }
  }
  text += "\n";
  return text;
};
export const ruleParse = (bookId: number, code: string) => {
  // 最初の#を見つけるまでidを-1にし、その間の内容は無効
  let ruleCurrent: Rule = { ...emptyRule(bookId), id: -1 };
  let categoryCurrent = "";
  const codeSplit = code.split("\n");
  const output: { ln: number; rule: Rule }[] = [];
  for (let i = 0; i < codeSplit.length; i++) {
    const l = codeSplit[i];
    if (l.startsWith("##")) {
      ruleCurrent.title = l.slice(2).trim();
    } else if (l.startsWith("#")) {
      if (ruleCurrent.id !== -1) {
        output.push({ ln: i, rule: ruleCurrent });
      }
      ruleCurrent = { ...emptyRule(bookId), num: l.slice(1).trim() };
    } else if (l.startsWith(">>")) {
      ruleCurrent.textTrans += l.slice(2).trim() + "\n";
    } else if (l.startsWith(">")) {
      ruleCurrent.text += l.slice(1).trim() + "\n";
    } else if (l.startsWith("@")) {
      categoryCurrent = l.slice(1).trim();
    } else if (l.startsWith("-")) {
      ruleCurrent.comments.push(
        newComment(bookId, l.slice(1).trim(), categoryCurrent, null, null)
      );
    } else {
      // skip
    }
  }
  if (ruleCurrent.num !== "") {
    output.push({ ln: codeSplit.length, rule: ruleCurrent });
  }
  return output;
};

const emptyRule = (bookId: number) =>
  ({
    id: 0, // 不要
    num: "",
    title: "",
    text: "",
    textTrans: "",
    comments: [],
    bookId: bookId,
  } as Rule);

const newComment = (
  bookId: number,
  text: string,
  categoryName: string,
  externalLink: string | null,
  externalName: string | null
) =>
  ({
    id: 0, // 不要
    text: text,
    category: {
      id: 0, // 不要
      name: categoryName,
      bookId: bookId,
      order: 0,
    },
    categoryId: 0, // 不要
    ruleId: 0, // 不要
    order: 0, // 不要
    externalLink: externalLink,
    externalName: externalName,
  } as Comment);

export const highlighter = (code: string) => {
  return (
    <>
      {code.split("\n").map((l, i) => (
        <div key={i} style={{ color: colorSelector(l) }}>
          {l || " "}
        </div>
      ))}
    </>
  );
};
