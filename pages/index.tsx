// import styles from '@/styles/Home.module.css'
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import AutoScroller from "components/scroller";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Element as ScrollElement } from "react-scroll";

interface Comment {
  text: string[];
  cid: number;
}
const comments: Comment[] = [
  {
    cid: 0,
    text: "手動操縦/自動操縦かは問わない",
  },
  {
    cid: 1,
    text: "うさぎロボットは、フィールド内の全てのエリア。ゾーン、橋に入ること ができます。",
  },
  { cid: 2, text: "うさぎは上空を含む相手チームのエリアへの立ち入りは 禁止" },
  { cid: 3, text: "うさぎは堀エリアに接地することはできません。" },
  { cid: 4, text: "うさぎはリングを拾うことができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 7, text: "うさぎは堀エリアに接地することはできません。" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
  { cid: 5, text: "うさぎはawaのポールにリングを投げ入れることができる" },
];
export default function Home() {
  const { query } = useRouter();
  const [activeCid, setActiveCid] = useState<string | undefined>();
  useEffect(() => {
    setActiveCid(query.cid);
  }, [query]);

  return (
    <div
      onClick={() => {
        setActiveCid();
      }}
    >
      <AutoScroller id={query.cid} />
      <Typography variant="h5" sx={{ p: 2 }}>
        ルール概要、コメント
      </Typography>
      <List sx={{ width: "100%" }}>
        {comments.map((m, i) => (
          <>
            <ScrollElement id={m.cid.toString()} />
            <ListItemButton
              key={i}
              sx={{ py: 0 }}
              selected={activeCid === m.cid.toString()}
            >
              <ListItemText primary={m.text} />
            </ListItemButton>
          </>
        ))}
      </List>
    </div>
  );
}
