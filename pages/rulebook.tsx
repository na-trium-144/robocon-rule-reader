import * as React from "react";
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import AutoScroller from "components/scroller";
import { useRouter } from "next/router";
import { Element as ScrollElement } from "react-scroll";
import { Rule } from "lib/types";
import { useApi } from "components/apiprovider";

const RuleItem = (props: {
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
const RuleItemActive = (props: { rule: Rule }) => {
  const { rule } = props;
  return (
    <>
      <ListItem key={rule.num} disablePadding>
        <Paper elevation={3} sx={{ p: 1, width: "100%" }}>
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

export default function RuleBook() {
  const { query } = useRouter();
  const [selectedRuleNum, setSelectedRuleNum] = useState<string>("");
  const [scrollRuleNum, setScrollRuleNum] = useState<string>("");
  useEffect(() => {
    if (typeof query.num === "string") {
      setSelectedRuleNum(query.num);
      setScrollRuleNum(query.num);
    }
  }, [query]);
  const { rules } = useApi();
  return (
    <Container
      sx={{ width: "100%", height: "100%" }}
      onClick={() => {
        setSelectedRuleNum("");
        setScrollRuleNum("");
      }}
    >
      <AutoScroller id={scrollRuleNum} />
      <Typography variant="h5">ルールブック原文</Typography>
      <List sx={{ width: "100%" }}>
        {rules.map((rule, i) => (
          <>
            <ScrollElement id={rule.num} name={rule.num} />
            {selectedRuleNum !== rule.num ? (
              <RuleItem
                key={i}
                rule={rule}
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  setSelectedRuleNum(rule.num);
                }}
              />
            ) : (
              <RuleItemActive key={i} rule={rule} />
            )}
          </>
        ))}
      </List>
    </Container>
  );
}
