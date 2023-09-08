import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { useApi } from "components/apiprovider";
import { Rule, Comment } from "lib/types";
import { highlighter, ruleText, ruleParse } from "components/syntax";

export default function RuleEditor() {
  const [code, setCode] = useState<string>("");
  const [codeTrans, setCodeTrans] = useState<string>("");
  const { currentBook, rules, editRule, apiResult, fetchAll } = useApi();

  useEffect(() => {
    const collator = new Intl.Collator([], { numeric: true });
    setCode(
      rules
        .sort((a, b) => collator.compare(a.num, b.num))
        .map((rule) => ruleText(rule, { text: true }))
        .join("")
    );
    setCodeTrans(
      rules
        .sort((a, b) => collator.compare(a.num, b.num))
        .map((rule) => ruleText(rule, { textTrans: true }))
        .join("")
    );
  }, []);
  useEffect(() => {
    setCode((code) => {
      let codeSplit = code.split("\n").filter((l) => l !== "");
      const codeTransSplit = codeTrans.split("\n");
      for (
        let i = 0, j = 0;
        i < codeSplit.length && j < codeTransSplit.length;
        i++, j++
      ) {
        if (codeTransSplit[j].startsWith("#")) {
          // codeよりcodeTransのほうが短い場合(なにもしない)
          while (i < codeSplit.length && !codeSplit[i].startsWith("#")) {
            i++;
          }
        } else {
          // codeよりcodeTransのほうが長い場合 codeに空行を追加
          if (i < codeSplit.length && codeSplit[i].startsWith("#")) {
            codeSplit = codeSplit
              .slice(0, i)
              .concat([""])
              .concat(codeSplit.slice(i));
          }
        }
      }
      return codeSplit.join("\n");
    });
  }, [codeTrans]);

  const [loading, setLoading] = useState<boolean>(false);
  const [ruleNotFound, setRuleNotFound] = useState<string>("");
  const ruleSend = async () => {
    setLoading(true);
    setRuleNotFound("");
    const rulesTrans = ruleParse(currentBook.id, codeTrans);
    for (const { ln, rule } of rulesTrans) {
      const rf = rules.find((r) => r.num === rule.num);
      if (rf) {
        const ok = await editRule({
          ...rf,
          ...rule,
        });
        if (!ok) {
          setLoading(false);
          return;
        }
        // setCodeTrans(codeTrans.split("\n").slice(i).join("\n"));
      } else {
        setRuleNotFound(rule.num);
        setLoading(false);
        return;
      }
    }
    fetchAll();
    setLoading(false);
  };
  return (
    <Container>
      <Typography variant="h5">ルール和訳 ({currentBook.name})</Typography>
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
      <Grid container sx={{ mt: 1 }} spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2">原文</Typography>
          <Box
            sx={{
              mt: 1,
              mb: 2,
              width: "100%",
              background: "lightgray",
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
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">和訳</Typography>
          <Box
            sx={{ mt: 1, mb: 2, width: "100%", border: 1, borderColor: "gray" }}
          >
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
          </Box>
        </Grid>
      </Grid>
      <LoadingButton
        variant="contained"
        onClick={() => {
          void ruleSend();
        }}
        loading={loading}
      >
        和訳を保存
      </LoadingButton>
      <span>{apiResult.msg}</span>
      <span>
        {ruleNotFound !== "" && `エラー: ルール ${ruleNotFound} は存在しません`}
      </span>
    </Container>
  );
}
