import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "next/link";
import { Rule, ApiReturnMsg } from "lib/types";

export const RuleItem = (props: {
  rule: Rule;
  onClick: (event: React.MouseEvent) => void;
}) => {
  const { rule, onClick } = props;
  return (
    <>
      <ListItemButton key={rule.num} onClick={onClick}>
        <Grid container alignItems="baseline" spacing={1}>
          <Grid item>
            <Typography variant="h6">{rule.num}</Typography>
          </Grid>
          <Grid item xs>
            <Box>
              {rule.text.split("\n").map((line, i) => (
                <Typography variant="body1" key={i}>
                  {line}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </ListItemButton>
    </>
  );
};

export const RuleItemActive = (props: {
  rule: Rule;
  editButtonClick: (event: React.MouseEvent) => void;
}) => {
  const { rule, editButtonClick } = props;
  return (
    <>
      <ListItem key={rule.num} disablePadding>
        <Paper elevation={3} sx={{ p: 1, width: "100%" }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Typography variant="h5">{rule.num}</Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  editButtonClick();
                }}
              >
                ルールを編集
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box>
                {rule.text.split("\n").map((line, i) => (
                  <Typography variant="body1" key={i}>
                    {line}
                  </Typography>
                ))}
              </Box>
            </Grid>
          </Grid>
          <List
            subheader={
              <ListSubheader>
                <Typography variant="subtitle2">
                  コメント ({rule.comments.length})
                </Typography>
              </ListSubheader>
            }
            sx={{ mt: 2, width: "100%" }}
          >
            {rule.comments.map((c, i) => (
              <ListItem dense key={i}>
                <Link href={`/?cid=${c.id}`}>
                  <Typography variant="body2">{c.text}</Typography>
                </Link>
              </ListItem>
            ))}
          </List>
        </Paper>
      </ListItem>
    </>
  );
};

export const RuleItemActiveEditing = (props: {
  rule: Rule;
  cancelEditing: () => void;
  editRule: (rule: Rule) => void;
  apiResult: ApiReturnMsg;
}) => {
  const { rule, cancelEditing, editRule, apiResult } = props;
  const [ruleNum, setRuleNum] = useState<string>(rule.num);
  const [ruleText, setRuleText] = useState<string>(rule.text.trim());
  return (
    <>
      <ListItem key={rule.num} disablePadding>
        <Paper elevation={3} sx={{ p: 1, width: "100%" }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <TextField
                label="Rule Number"
                variant="outlined"
                value={ruleNum}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setRuleNum(event.target.value);
                }}
                size="small"
              />
            </Grid>
            <Grid item>
              <Button
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  editRule({ id: rule.id, num: ruleNum, text: ruleText });
                }}
              >
                保存
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  cancelEditing();
                }}
              >
                キャンセル
              </Button>
            </Grid>
            <Grid item>
              <span>{apiResult.msg}</span>
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                value={ruleText}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setRuleText(event.target.value);
                }}
                variant="standard"
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>
      </ListItem>
    </>
  );
};
