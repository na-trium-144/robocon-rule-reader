// import styles from '@/styles/Home.module.css'
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

const comments = [
  {
    text: "手動操縦/自動操縦かは問わない",
  },
  {
    text: "うさぎロボットは、フィールド内の全てのエリア。ゾーン、橋に入ること ができます。",
  },
  { text: "うさぎは上空を含む相手チームのエリアへの立ち入りは 禁止" },
  { text: "うさぎは堀エリアに接地することはできません。" },
  { text: "うさぎはリングを拾うことができる" },
  { text: "うさぎはawaのポールにリングを投げ入れることができる" },
];
export default function Home() {
  return (
    <>
      <Typography variant="h5" sx={{ p: 2 }}>
        ルール概要、コメント
      </Typography>
      <List sx={{ width: "100%" }}>
        {comments.map((m, i) => (
          <>
            <ListItemButton key={i} sx={{ py: 0 }}>
              <ListItemText primary={m.text} />
            </ListItemButton>
          </>
        ))}
      </List>
    </>
  );
}
