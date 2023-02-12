// import styles from '@/styles/Home.module.css'
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import AutoScroller from "components/scroller";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import * as React from "react";
import { Element as ScrollElement } from "react-scroll";
import { useApi } from "components/apiprovider";
import { CommentItem, CommentItemEditing } from "components/commentitem";
import { Comment } from "lib/types";

export default function Home() {
  const { query } = useRouter();
  const [activeCid, setActiveCid] = useState<string | null>(null);
  const [editingCid, setEditingCid] = useState<string | null>(null);
  const { categories, editComment, fetchAll } = useApi();
  useEffect(() => {
    if (typeof query.cid === "string") {
      setActiveCid(query.cid);
    }
  }, [query]);

  const collator = new Intl.Collator([], { numeric: true });
  return (
    <Container
      onClick={() => {
        setActiveCid(null);
        setEditingCid(null);
      }}
    >
      <AutoScroller id={activeCid} />
      <Typography variant="h5">ルール概要、コメント</Typography>
      {categories
        .sort((a, b) => collator.compare(a.name, b.name))
        .map((g, i) => (
          <>
            <Typography variant="h6">{g.name}</Typography>
            <List sx={{ width: "100%" }}>
              {g.comments.map((m, i) => (
                <>
                  <ScrollElement id={m.id.toString()} name={m.id.toString()} />
                  {editingCid === m.id.toString() ? (
                    <CommentItemEditing
                      isActive={activeCid === m.id.toString()}
                      comment={m}
                      key={i}
                      editComment={(comment: Comment) => {
                        void (async () => {
                          const ok = await editComment(comment);
                          if (ok) {
                            setEditingCid(null);
                            fetchAll();
                          }
                        })();
                      }}
                    />
                  ) : (
                    <CommentItem
                      isActive={activeCid === m.id.toString()}
                      comment={m}
                      key={i}
                      editButtonClick={() => {
                        setEditingCid(m.id.toString());
                      }}
                    />
                  )}
                </>
              ))}
            </List>
          </>
        ))}
    </Container>
  );
}
