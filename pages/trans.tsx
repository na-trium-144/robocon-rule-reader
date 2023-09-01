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
import { highlighter } from "./editor";

export default function RuleEditor() {
  const [code, setCode] = useState<string>("");
  const [codeTrans, setCodeTrans] = useState<string>("");
  const { currentBook, rules, editRule, apiResult, fetchAll } = useApi();

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
  const [ruleNotFound, setRuleNotFound] = useState<string>("");
  const ruleParse = async () => {
    setLoading(true);
    setRuleNotFound("");
    let ruleCurrent: Rule = { ...emptyRule(), id: -1 };

    for (let i = 0; i < codeTrans.split("\n").length; i++) {
      const l = codeTrans.split("\n")[i];
      if (l.startsWith("#")) {
        if (ruleCurrent.id != -1) {
          const ok = await editRule(ruleCurrent);
          if (!ok) {
            setLoading(false);
            return;
          }
          // setCodeTrans(codeTrans.split("\n").slice(i).join("\n"));
        }
        const num = l.slice(1).trim();
        const rf = rules.find((r) => r.num === num);
        if (rf) {
          ruleCurrent = rf;
        } else {
          setRuleNotFound(num);
          setLoading(false);
          return;
        }
        ruleCurrent.textTrans = "";
      } else if (l.startsWith(">")) {
        ruleCurrent.textTrans += l.slice(1).trim() + "\n";
      } else {
        // skip
      }
    }
    if (ruleCurrent.num !== "") {
      const ok = await editRule(ruleCurrent);
      if (!ok) {
        setLoading(false);
        return;
      }
      // setCodeTrans("");
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
          void ruleParse();
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
