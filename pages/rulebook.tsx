import { useState, useEffect } from "react";
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

interface Comment {
  text: string[];
  cid: number;
}
interface Rule {
  num: string;
  text: string[];
  comments: Comment[];
}
const rulebook: Rule[] = [
  {
    num: "1.1",
    text: ["チーム", "試合は赤チームと青チームで行います。"],
    comments: [],
  },
  {
    num: "1.2",
    text: [
      "ロボット",
      "各チームはうさぎロボットとぞうロボットをそれぞれ 1 台ずつ、最大 2 台のロボットを製作できます。 手動操縦/自動操縦かは問いま せん。",
    ],
    comments: [
      {
        cid: 0,
        text: "手動操縦/自動操縦かは問わない",
      },
    ],
  },
  {
    num: "1.3",
    text: [
      "うさぎロボット (うさぎ)",
      "うさぎロボットは、フィールド内の全てのエリア。ゾーン、橋に入ること ができます。ただし上空を含む相手チームのエリアへの立ち入りは 禁止です。また堀エリアに接地することはできません。 うさぎはリングを拾うことができます。またアンコールワットエリアのポ ールにリングを投げ入れることができます。",
    ],
    comments: [
      {
        cid: 1,
        text: "うさぎロボットは、フィールド内の全てのエリア。ゾーン、橋に入ること ができます。",
      },
      {
        cid: 2,
        text: "うさぎは上空を含む相手チームのエリアへの立ち入りは 禁止",
      },
      { cid: 3, text: "うさぎは堀エリアに接地することはできません。" },
      { cid: 4, text: "うさぎはリングを拾うことができる" },
      { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
    ],
  },
  {
    num: "1.4",
    text: [
      "ぞうロボット (ぞう)",
      "ぞうロボットはフィールド内のレッド・サイドエリアあるいはブルー・サイ ドエリア、堀、橋に入ることができます。ぞうはアンコールワットエリ ア、相手チームのエリアへ上空を含み入ることができません。また 堀エリアと橋に接地することはできません。 ぞうはリングを拾うことができます。またアンコールワットエリアのポー ルにリングを投げ入れることができます。",
    ],
    comments: [],
  },
  {
    num: "1.5",
    text: [
      "フィールド",
      "フィールドは、ロボットが競技を行う場所全体のことを指します。 12,000mm × 12,000mm の正方形です。",
    ],
    comments: [],
  },
  {
    num: "1.6",
    text: [
      "スタートゾーン",
      "スタートゾーンは、試合開始時にロボットを置く場所です。フィール ドには、各チームのロボット用に 1 つずつスタート ゾーンがありま す。 1,500mm×1,000mm の長方形です。",
    ],
    comments: [],
  },
];

const RuleItem = (props: { rule: Rule; onClick: () => void }) => {
  const { rule, onClick } = props;
  return (
    <>
      <ListItemButton key={rule.num} onClick={onClick}>
        <Grid container alignItems="flex-start" spacing={1}>
          <Grid item>
            <Typography variant="body1" nowrap>
              {rule.num}
            </Typography>
          </Grid>
          <Grid item xs>
            <Box>
              {rule.text.map((line, i) => (
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
      <ListItem key={rule.num}>
        <Paper elevation={3} sx={{ padding: 1, width: "100%" }}>
          <Grid container alignItems="flex-start" spacing={1}>
            <Grid item>
              <Typography variant="body1" nowrap>
                {rule.num}
              </Typography>
            </Grid>
            <Grid item xs>
              <Box>
                {rule.text.map((line, i) => (
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
            {rule.comments.map((c, i) => (<>
              <Link key={i} legacyBehavior href={`/#${c.cid}` /* ← スクロールはするがAppBarに隠れてしまう */}>
                <ListItemButton dense>
                  <Typography variant="body2">{c.text}</Typography>
                </ListItemButton>
              </Link>
              </>
            ))}
          </List>
        </Paper>
      </ListItem>
    </>
  );
};

export default function RuleBook() {
  const [selectedRuleNum, setSelectedRuleNum] = useState<string>("");
  return (
    <div
      sx={{ width: "100%", height: "100%" }}
      onClick={() => {
        setSelectedRuleNum("");
      }}
    >
      <Typography variant="h5" sx={{ p: 2 }}>
        ルールブック原文
      </Typography>
      <List sx={{ width: "100%" }}>
        {rulebook.map((rule, i) =>
          selectedRuleNum !== rule.num ? (
            <RuleItem
              key={i}
              rule={rule}
              onClick={(event) => {
                event.stopPropagation();
                setSelectedRuleNum(rule.num);
              }}
            />
          ) : (
            <RuleItemActive key={i} rule={rule} />
          )
        )}
      </List>
    </div>
  );
}