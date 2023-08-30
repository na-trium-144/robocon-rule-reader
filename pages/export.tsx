import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useApi } from "components/apiprovider";
import { Rule, Comment } from "lib/types";
import { highlighter } from "./editor";

export default function RuleEditor() {
  const [code, setCode] = useState<string>("");
  const { rules, editRuleTrans, apiResult, fetchAll } = useApi();

  useEffect(() => {
    const collator = new Intl.Collator([], { numeric: true });
    setCode(
      rules
        .sort((a, b) => collator.compare(a.num, b.num))
        .reduce(
          (prev, rule) =>
            prev +
            `#${rule.num}\n` +
            rule.text
              .split("\n")
              .filter((l) => l.length > 0)
              .map((l) => `>${l}\n`)
              .join("") + 
            rule.textTrans
              .split("\n")
              .filter((l) => l.length > 0)
              .map((l) => `>>${l}\n`)
              .join("") +
            rule.comments.reduce(
              ({ str, prevCategory }, c) => {
                if (prevCategory !== c.category.name) {
                  str += `@${c.category.name}\n`;
                }
                str += `-${c.text}\n`;
                return { str, prevCategory: c.category.name };
              },
              { str: "", prevCategory: "" }
            ).str +
            "\n\n",
          ""
        )
    );
  }, []);

  return (
    <Container>
      <Typography variant="h5">ルールエクスポート</Typography>
      <Box
        sx={{
          mt: 1,
          mb: 2,
          width: "100%",
          border: 1,
          borderColor: "gray",
          p: 1,
          fontFamily: "monospace",
        }}
      >
        {highlighter(code)}
      </Box>
    </Container>
  );
}
