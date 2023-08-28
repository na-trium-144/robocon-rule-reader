import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemText from "@mui/material/ListItemText";
import LinkIcon from "@mui/icons-material/Link";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Badge from "@mui/material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChatIcon from "@mui/icons-material/Chat";
import Link from "next/link";
import { Rule, ApiReturnMsg, Comment } from "lib/types";
import { useMediaQuery } from "react-responsive";

const ruleSplitBoth = (rule: string, ruleTrans: string) => {
  const ruleSplit = rule.split("\n").filter((l) => l !== "");
  const ruleTransSplit = ruleTrans.split("\n").filter((l) => l !== "");
  if (ruleTransSplit.length === 0) {
    return ruleSplit.map((r) => [r]);
  } else {
    while (ruleSplit.length < ruleTransSplit.length) {
      ruleSplit.push("");
    }
    while (ruleSplit.length > ruleTransSplit.length) {
      ruleTransSplit.push("");
    }
    return ruleSplit.map((r, i) => [r, ruleTransSplit[i]]);
  }
};

const RuleTextGrid = (props: {
  ruleBoth: string[][];
  showTransOnMobile: boolean;
}) => {
  const { ruleBoth, showTransOnMobile } = props;
  const isPC = useMediaQuery({ minWidth: 640 });
  const gridRow = isPC ? ruleBoth.length : ruleBoth.length * 2 + 1;
  return (
    <div
      style={{
        display: "grid",
        width: "100%",
        gridAutoFlow: "column",
        gridTemplateRows: "auto ".repeat(gridRow),
        gridAutoColumns: "1fr",
        columnGap: "10px",
      }}
    >
      {ruleBoth.map((rb, i) =>
        rb.length === 1 ? (
          <div
            key={i}
            style={{
              gridColumnStart: 1,
              gridColumnEnd: 3,
              overflowWrap: "anywhere",
            }}
          >
            {rb[0]}
          </div>
        ) : (
          <div key={i} style={{ overflowWrap: "anywhere" }}>
            {rb[0]}
          </div>
        )
      )}
      {!isPC && showTransOnMobile && <div style={{ height: "10px" }} />}
      {(isPC || showTransOnMobile) &&
        ruleBoth.map(
          (rb, i) =>
            rb.length !== 1 && (
              <div key={i} style={{ overflowWrap: "anywhere" }}>
                {rb[1]}
              </div>
            )
        )}
    </div>
  );
};
export const RuleItem = (props: {
  rule: Rule;
  onClick: (event: React.MouseEvent) => void;
}) => {
  const { rule, onClick } = props;
  const ruleBoth = ruleSplitBoth(rule.text, rule.textTrans);
  return (
    <>
      <ListItemButton dense key={rule.num} onClick={onClick}>
        <Grid
          container
          sx={{
            width: "100%",
          }}
        >
          <Grid item xs={12}>
            <Typography variant="body1" component="span" sx={{ mr: 1 }}>
              {rule.num}
            </Typography>
            {rule.comments.length >= 1 && (
              <Badge
                badgeContent={rule.comments.length}
                overlap="circular"
                color="warning"
                sx={{ mr: 1 }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <ChatIcon color="action" />
              </Badge>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              <RuleTextGrid ruleBoth={ruleBoth} showTransOnMobile={false} />
            </Typography>
          </Grid>
        </Grid>
      </ListItemButton>
    </>
  );
};

export const RuleItemCompact = (props: {
  rule: Rule;
  onClick: (event: React.MouseEvent) => void;
}) => {
  const { rule, onClick } = props;
  return (
    <>
      <ListItemButton dense key={rule.num} onClick={onClick}>
        <Typography
          variant="body1"
          sx={{
            textOverflow: "ellipsis",
            width: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <Typography variant="h6" component="span" sx={{ mr: 1 }}>
            {rule.num}
          </Typography>
          {rule.comments.length >= 1 && (
            <Badge
              badgeContent={rule.comments.length}
              overlap="circular"
              color="warning"
              sx={{ mr: 1 }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <ChatIcon color="action" />
            </Badge>
          )}
          {rule.text}
        </Typography>
      </ListItemButton>
    </>
  );
};

export const RuleItemActive = (props: {
  rule: Rule;
  editButtonClick: () => void;
  addComment: (comment: Comment) => void;
  onDelete: () => void;
}) => {
  const { rule, editButtonClick, addComment } = props;
  const [newCategory, setNewCategory] = useState<string>("");
  const [newText, setNewText] = useState<string>("");
  const ruleBoth = ruleSplitBoth(rule.text, rule.textTrans);
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <>
      <ListItem
        key={rule.num}
        disablePadding
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
        }}
      >
        <Paper elevation={3} sx={{ p: 2, my: 1, width: "100%" }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs={12} sm="auto">
              <Typography variant="h5">
                {rule.num}
                <Link href={`/rulebook?num=${rule.num}`}>
                  <IconButton
                    onClick={() => {
                      navigator?.clipboard
                        ?.writeText(
                          `${window.location.origin}/rulebook?num=${rule.num}`
                        )
                        .then(() => {
                          setCopied(true);
                        })
                        .catch(() => undefined);
                    }}
                  >
                    <LinkIcon />
                  </IconButton>
                </Link>
                {copied && (
                  <Typography variant="caption">
                    リンクをコピーしました！
                  </Typography>
                )}
              </Typography>
            </Grid>
            <Grid item xs>
              <Button
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  editButtonClick();
                }}
                startIcon={<EditIcon />}
              >
                ルールを編集
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  props.onDelete();
                }}
                color="error"
              >
                削除
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <RuleTextGrid ruleBoth={ruleBoth} showTransOnMobile={true} />
              </Typography>
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
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <Chip
                      color="warning"
                      variant="outlined"
                      size="small"
                      icon={<LocalOfferIcon />}
                      label={c.category != undefined ? c.category.name : ""}
                    />
                  </Grid>
                  <Grid item xs>
                    <Link href={`/?cid=${c.id}`}>
                      <Typography variant="body2">{c.text}</Typography>
                    </Link>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
            <ListItem>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={3} md={2} xl={1}>
                  <TextField
                    size="small"
                    color="warning"
                    variant="standard"
                    placeholder="Category"
                    fullWidth
                    value={newCategory}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setNewCategory(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="Text"
                    fullWidth
                    value={newText}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setNewText(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }}
                    startIcon={<AddCircleIcon />}
                    onClick={() => {
                      addComment({
                        id: 0,
                        text: newText,
                        ruleId: rule.id,
                        rule: rule,
                        category: { id: 0, name: newCategory },
                        categoryId: 0,
                        order: 0,
                      });
                    }}
                  >
                    追加
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
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
  const [ruleHasTrans, setRuleHasTrans] = useState<boolean>(
    !!rule.textTrans.trim()
  );
  const [ruleTextTrans, setRuleTextTrans] = useState<string>(
    rule.textTrans.trim()
  );
  return (
    <>
      <ListItem
        key={rule.num}
        disablePadding
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
        }}
      >
        <Paper elevation={3} sx={{ p: 2, my: 1, width: "100%" }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs={12} sm="auto">
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
                  editRule({
                    id: rule.id,
                    num: ruleNum,
                    text: ruleText,
                    textTrans: ruleTextTrans,
                    comments: rule.comments,
                  });
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
                color="secondary"
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
                label="原文"
                size="small"
              />
            </Grid>
            {ruleHasTrans && (
              <Grid item xs={12}>
                <TextField
                  multiline
                  value={ruleTextTrans}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setRuleTextTrans(event.target.value);
                  }}
                  variant="standard"
                  fullWidth
                  label="日本語訳"
                  size="small"
                />
              </Grid>
            )}
          </Grid>
        </Paper>
      </ListItem>
    </>
  );
};
