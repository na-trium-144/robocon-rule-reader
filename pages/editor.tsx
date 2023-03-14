import { useState } from "react";
import Editor from "react-simple-code-editor";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useApi } from "components/apiprovider";
import { Rule, Comment } from "lib/types";

const highlighter = (code: string) => {
  const colorSelector = (l: string) => {
    if (l.startsWith("#")) {
      return "brown";
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

export default function RuleEditor() {
  const [code, setCode] = useState("");
  const { addRule, apiResult, fetchAll } = useApi();
  const ruleParse = async () => {
    let ruleCurrent: Rule = {
      id: -1,
      num: "",
      text: "",
      comments: [],
    };
    let categoryCurrent = "";

    for (let i = 0; i < code.split("\n").length; i++) {
      const l = code.split("\n")[i];
      if (l.startsWith("#")) {
        if (ruleCurrent.id != -1) {
          const ok = await addRule(ruleCurrent);
          if (!ok) {
            return;
          }
          setCode(code.split("\n").slice(i).join("\n"));
        }
        ruleCurrent = {
          id: 0,
          num: "",
          text: "",
          comments: [],
        };
        ruleCurrent.num = l.slice(1).trim();
      } else if (l.startsWith(">")) {
        ruleCurrent.text += l.slice(1).trim() + "\n";
      } else if (l.startsWith("@")) {
        categoryCurrent = l.slice(1).trim();
      } else if (l.startsWith("-")) {
        ruleCurrent.comments.push({
          id: 0,
          text: l.slice(1).trim(),
          category: { id: 0, name: categoryCurrent },
          categoryId: 0,
          ruleId: 0,
          order: 0,
        });
      } else {
        // skip
      }
    }
    if (ruleCurrent.num !== "") {
      const ok = await addRule(ruleCurrent);
      if (!ok) {
        return;
      }
      setCode("");
    }
    fetchAll();
  };
  return (
    <Container>
      <Typography variant="h5">ルールインポート</Typography>
      <Typography variant="body1">
        以下にルールまたはFAQをコピペし、整形してください。
      </Typography>
      <Typography variant="body2">書式:</Typography>
      <div
        style={{
          paddingLeft: 20,
          fontFamily: "monospace",
        }}
      >
        {highlighter(
          "# ルール番号 or FAQ番号\n> ルール本文ルール本文ルール本文ルール本文ルール本文\n> ルール本文ルール本文ルール本文ルール本文ルール本文\n@ カテゴリー\n- 要約・コメント\n- 要約・コメント\n"
        )}
      </div>
      <Paper elevation={3} sx={{ my: 2, width: "100%" }}>
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={highlighter}
          padding={10}
          ignoreTabKey
          style={{
            fontFamily: "monospace",
          }}
        />
      </Paper>
      <Button
        variant="contained"
        onClick={() => {
          void ruleParse();
        }}
      >
        インポート
      </Button>
      <span>{apiResult.msg}</span>
    </Container>
  );
}
