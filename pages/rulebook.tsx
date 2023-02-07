import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

const rulebook = [
  { num: "1.1", text: ["チーム", "試合は赤チームと青チームで行います。"] },
  {
    num: "1.2",
    text: [
      "ロボット",
      "各チームはうさぎロボットとぞうロボットをそれぞれ 1 台ずつ、最大 2 台のロボットを製作できます。 手動操縦/自動操縦かは問いま せん。",
    ],
  },
  {
    num: "1.3",
    text: [
      "うさぎロボット (うさぎ)",
      "うさぎロボットは、フィールド内の全てのエリア。ゾーン、橋に入ること ができます。ただし上空を含む相手チームのエリアへの立ち入りは 禁止です。また堀エリアに接地することはできません。 うさぎはリングを拾うことができます。またアンコールワットエリアのポ ールにリングを投げ入れることができます。",
    ],
  },
  {
    num: "1.4",
    text: [
      "ぞうロボット (ぞう)",
      "ぞうロボットはフィールド内のレッド・サイドエリアあるいはブルー・サイ ドエリア、堀、橋に入ることができます。ぞうはアンコールワットエリ ア、相手チームのエリアへ上空を含み入ることができません。また 堀エリアと橋に接地することはできません。 ぞうはリングを拾うことができます。またアンコールワットエリアのポー ルにリングを投げ入れることができます。",
    ],
  },
  {
    num: "1.5",
    text: [
      "フィールド",
      "フィールドは、ロボットが競技を行う場所全体のことを指します。 12,000mm × 12,000mm の正方形です。",
    ],
  },
  {
    num: "1.6",
    text: [
      "スタートゾーン",
      "スタートゾーンは、試合開始時にロボットを置く場所です。フィール ドには、各チームのロボット用に 1 つずつスタート ゾーンがありま す。 1,500mm×1,000mm の長方形です。",
    ],
  },
];

export default function RuleBook() {
  return (
    <>
      <Typography variant="h5" sx={{ p: 2 }}>
        ルールブック原文
      </Typography>
      <List sx={{ width: "100%" }}>
        {rulebook.map((rule) => (
          <ListItemButton key={rule.num}>
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
        ))}
      </List>
    </>
  );
}
