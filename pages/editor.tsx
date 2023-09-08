import { useState } from "react";
import Editor from "react-simple-code-editor";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { useApi } from "components/apiprovider";
import { Rule, Comment } from "lib/types";
import { ruleParse, highlighter } from "components/syntax";

export default function RuleEditor() {
  const [code, setCode] = useState("");
  const { currentBook, addRule, apiResult, fetchAll } = useApi();

  const [loading, setLoading] = useState<boolean>(false);
  const ruleSend = async () => {
    setLoading(true);
    const rules = ruleParse(currentBook.id, code);
    for(const {ln, rule} of rules){
      const ok = await addRule(rule);
      if (!ok) {
        setLoading(false);
        return;
      }
      setCode(code.split("\n").slice(ln).join("\n"));
    }
    fetchAll();
    setLoading(false);
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
          void ruleSend();
        }}
        loading={loading}
      >
        インポート
      </LoadingButton>
      <span>{apiResult.msg}</span>
    </Container>
  );
}
