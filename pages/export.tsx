import { useState, useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useApi } from "components/apiprovider";
import { Rule, Comment } from "lib/types";
import { highlighter, ruleText } from "components/syntax";

export default function RuleExport() {
  const [code, setCode] = useState<string>("");
  const codeBlob = useRef<null | Blob>(null);
  const [objUrl, setObjUrl] = useState<string>("");
  const { rules, currentBook } = useApi();

  useEffect(() => {
    const collator = new Intl.Collator([], { numeric: true });
    const code = rules
      .sort((a, b) => collator.compare(a.num, b.num))
      .map((rule) =>
        ruleText(rule, { title: true, text: true, textTrans: true, comments: true })
      )
      .join("");
    setCode(code);
    codeBlob.current = new Blob([code], { type: "text/plain" });
    const url = window.URL.createObjectURL(codeBlob.current);
    setObjUrl(url);
  }, [rules]);

  return (
    <Container>
      <Typography variant="h5">
        ルールエクスポート ({currentBook.name})
      </Typography>
      <Box sx={{ py: 1 }}>
        <a href={objUrl} download="rule_reader.txt">
          <Button variant="contained">ダウンロード</Button>
        </a>
      </Box>
      <Box
        sx={{
          mt: 1,
          mb: 2,
          width: "100%",
          border: 1,
          borderColor: "gray",
        }}
      >
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
      </Box>
    </Container>
  );
}
