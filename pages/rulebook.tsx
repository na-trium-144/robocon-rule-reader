import * as React from "react";
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import AutoScroller from "components/scroller";
import MenuIcon from "@mui/icons-material/Menu";
import ListIcon from "@mui/icons-material/List";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";
import { Element as ScrollElement } from "react-scroll";
import { Rule, ApiReturnMsg, Comment } from "lib/types";
import { useApi } from "components/apiprovider";
import {
  RuleItem,
  RuleItemActive,
  RuleItemActiveEditing,
} from "components/ruleitem";

export default function RuleBook() {
  const { query } = useRouter();
  const [selectedRuleNum, setSelectedRuleNum] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [scrollRuleNum, setScrollRuleNum] = useState<string>("");
  useEffect(() => {
    setTimeout(() => {
      if (typeof query.num === "string") {
        setSelectedRuleNum(query.num);
        setIsEditing(false);
        setScrollRuleNum(query.num);
      }
    }, 100);
  }, [query]);
  const { rules, editRule, fetchAll, apiResult, addComment, deleteRule } =
    useApi();
  const collator = new Intl.Collator([], { numeric: true });
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Container
      sx={{ width: "100%", height: "100%" }}
      onClick={() => {
        if (!isEditing) {
          setSelectedRuleNum("");
          setScrollRuleNum("");
          setIsEditing(false);
        }
      }}
    >
      <AutoScroller id={scrollRuleNum} />
      <Typography variant="h5">ルールブック原文</Typography>
      <List sx={{ width: "100%" }}>
        {rules
          .sort((a, b) => collator.compare(a.num, b.num))
          .map((rule, i) => (
            <>
              <ScrollElement id={rule.num} name={rule.num} />
              {selectedRuleNum !== rule.num ? (
                <RuleItem
                  key={i}
                  rule={rule}
                  onClick={(event: React.MouseEvent) => {
                    if (!isEditing) {
                      event.stopPropagation();
                      setSelectedRuleNum(rule.num);
                      setIsEditing(false);
                    }
                  }}
                />
              ) : isEditing ? (
                <RuleItemActiveEditing
                  key={i}
                  rule={rule}
                  cancelEditing={() => {
                    setIsEditing(false);
                  }}
                  editRule={(rule: Rule) => {
                    void (async () => {
                      const ok = await editRule(rule);
                      if (ok) {
                        setIsEditing(false);
                        fetchAll();
                      }
                    })();
                  }}
                  apiResult={apiResult}
                />
              ) : (
                <RuleItemActive
                  key={i}
                  rule={rule}
                  editButtonClick={() => {
                    setIsEditing(true);
                    apiResult.msg = "";
                  }}
                  addComment={(comment: Comment) => {
                    void (async () => {
                      const ok = await addComment(comment);
                      if (ok) {
                        fetchAll();
                      }
                    })();
                  }}
                  onDelete={() => {
                    if (confirm("このルール文を削除しますか?")) {
                      void (async () => {
                        const ok = await deleteRule(rule);
                        if (ok) {
                          fetchAll();
                        }
                      })();
                    }
                  }}
                />
              )}
            </>
          ))}
      </List>
      <div
        style={{ position: "fixed", right: "20px", bottom: "20px", zIndex: 10 }}
      >
        <Fab
          color="primary"
          size="small"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setMenuAnchorEl(event.currentTarget);
          }}
        >
          <ListIcon />
        </Fab>
      </div>
      <Menu
        open={!!menuAnchorEl}
        anchorEl={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            maxHeight: "50%",
            width: "240px",
          },
        }}
      >
        {rules.map((r, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              setMenuAnchorEl(null);
              setTimeout(() => {
                setSelectedRuleNum(r.num);
                setIsEditing(false);
                setScrollRuleNum(r.num);
              }, 100);
            }}
          >
            <Typography variant="body2" noWrap>
              {r.num}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Container>
  );
}
