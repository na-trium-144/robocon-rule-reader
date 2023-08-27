import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useApi } from "components/apiprovider";
import { Rule, Comment } from "lib/types";
import { highlighter } from "./editor";

export default function RuleEditor() {
  const [code, setCode] = useState("");
  const [codeTrans, setCodeTrans] = useState("");
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
              .filter((l, i) => i === 0 || l.length > 0)
              .map((l) => `>${l}`)
              .join("\n") +
            "\n\n",
          ""
        )
    );
    setCodeTrans(
      rules
        .sort((a, b) => collator.compare(a.num, b.num))
        .reduce(
          (prev, rule) =>
            prev +
            `#${rule.num}\n` +
            (rule.textTrans || "")
              .split("\n")
              .filter((l, i) => i === 0 || l.length > 0)
              .map((l) => `>${l}`)
              .join("\n") +
            "\n\n",
          ""
        )
    );
  }, []);
  const ruleParse = async () => {
    let ruleCurrent: Rule = {
      id: -1,
      num: "",
      text: "",
      comments: [],
      textTrans: "",
    };

    for (let i = 0; i < codeTrans.split("\n").length; i++) {
      const l = codeTrans.split("\n")[i];
      if (l.startsWith("#")) {
        if (ruleCurrent.id != -1) {
          const ok = await editRuleTrans(ruleCurrent);
          if (!ok) {
            return;
          }
          // setCodeTrans(codeTrans.split("\n").slice(i).join("\n"));
        }
        ruleCurrent = {
          id: 0,
          num: "",
          text: "",
          comments: [],
          textTrans: "",
        };
        ruleCurrent.num = l.slice(1).trim();
      } else if (l.startsWith(">")) {
        ruleCurrent.textTrans += l.slice(1).trim() + "\n";
      } else {
        // skip
      }
    }
    if (ruleCurrent.num !== "") {
      const ok = await editRuleTrans(ruleCurrent);
      if (!ok) {
        return;
      }
      // setCodeTrans("");
    }
    fetchAll();
  };
  return (
    <Container>
      <Typography variant="h5">ルール和訳</Typography>
      <Typography variant="body1">
        右枠の日本語訳を編集してください。
      </Typography>
      <Typography variant="body2">書式:</Typography>
      <div
        style={{
          paddingLeft: 20,
          fontFamily: "monospace",
        }}
      >
        {highlighter(
          "# ルール番号 or FAQ番号\n> ルール本文ルール本文ルール本文ルール本文ルール本文\n> ルール本文ルール本文ルール本文ルール本文ルール本文\n"
        )}
      </div>
      <Grid container sx={{mt: 1}} spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2">原文</Typography>
          <Paper elevation={3} sx={{ my: 2, width: "100%" }}>
            <Editor
              value={code}
              onValueChange={() => undefined}
              highlight={highlighter}
              padding={10}
              ignoreTabKey
              style={{
                fontFamily: "monospace",
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">和訳</Typography>
          <Paper elevation={3} sx={{ my: 2, width: "100%" }}>
            <Editor
              value={codeTrans}
              onValueChange={(code) => setCodeTrans(code)}
              highlight={highlighter}
              padding={10}
              ignoreTabKey
              style={{
                fontFamily: "monospace",
              }}
            />
          </Paper>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        onClick={() => {
          void ruleParse();
        }}
      >
        和訳を保存
      </Button>
      <span>{apiResult.msg}</span>
    </Container>
  );
}
