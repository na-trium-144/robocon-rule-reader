import { useState } from "react";
import Editor from "react-simple-code-editor";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from '@mui/lab/LoadingButton';
import { useApi } from "components/apiprovider";
import { Rule, Comment } from "lib/types";

export const highlighter = (code: string) => {
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
  const { currentBook, addRule, apiResult, fetchAll } = useApi();
  const emptyRule = () => ({
    id: 0,
    num: "",
    title: "",
    text: "",
    textTrans: "",
    comments: [],
    bookId: currentBook.id,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const ruleParse = async () => {
      setLoading(true);
    let ruleCurrent: Rule = { ...emptyRule(), id: -1 };
    let categoryCurrent = "";

    for (let i = 0; i < code.split("\n").length; i++) {
      const l = code.split("\n")[i];
      if (l.startsWith("##")) {
        ruleCurrent.title = l.slice(2).trim();
      } else if (l.startsWith("#")) {
        if (ruleCurrent.id != -1) {
          const ok = await addRule(ruleCurrent);
          if (!ok) {
            setLoading(false)
            return;
          }
          setCode(code.split("\n").slice(i).join("\n"));
        }
        ruleCurrent = emptyRule();
        ruleCurrent.num = l.slice(1).trim();
      } else if (l.startsWith(">>")) {
        ruleCurrent.textTrans += l.slice(2).trim() + "\n";
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
        setLoading(false)
        return;
      }
      setCode("");
    }
    fetchAll();
      setLoading(false)
  };
  return (
    <Container>
      <Typography variant="h5">
        ルールインポート ({currentBook.name})
      </Typography>
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
          "# ルール番号 or FAQ番号\n" +
            "## タイトル\n" +
            "> ルール本文ルール本文ルール本文ルール本文ルール本文\n" +
            "> ルール本文ルール本文ルール本文ルール本文ルール本文\n" +
            // ">> 和訳和訳\n" +
            "@ カテゴリー\n" +
            "- 要約・コメント\n" +
            "- 要約・コメント\n"
        )}
      </div>
      <Box sx={{ my: 2, width: "100%", border: 1, borderColor: "gray" }}>
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
      </Box>
      <LoadingButton
        variant="contained"
        onClick={() => {
          void ruleParse();
        }}
        loading={loading}
      >
        インポート
      </LoadingButton>
      <span>{apiResult.msg}</span>
    </Container>
  );
}
