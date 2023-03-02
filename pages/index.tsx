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
import { Comment, Category } from "lib/types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Home() {
  const { query } = useRouter();
  const [activeCid, setActiveCid] = useState<number | null>(null);
  const [editingCid, setEditingCid] = useState<number | null>(null);
  const [draggingCid, setDraggingCid] = useState<number | null>(null);
  const { categories, editComment, fetchAll, setCommentOrder } = useApi();
  useEffect(() => {
    if (typeof query.cid === "string") {
      setActiveCid(parseInt(query.cid));
    }
  }, [query]);

  console.log(draggingCid);
  const collator = new Intl.Collator([], { numeric: true });
  return (
    <DndProvider backend={HTML5Backend}>
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
            <div key={g.name}>
              <Typography variant="h6">{g.name}</Typography>
              <List sx={{ width: "100%" }}>
                {g.comments
                  .sort((a, b) =>
                    a.order < b.order ? -1 : a.order > b.order ? 1 : 0
                  )
                  .map((m, i, commentsSorted) => (
                    <div key={i}>
                      <ScrollElement
                        id={m.id.toString()}
                        name={m.id.toString()}
                      />
                      {editingCid === m.id ? (
                        <CommentItemEditing
                          isActive={activeCid === m.id}
                          comment={{ ...m, category: g }}
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
                          isActive={activeCid === m.id}
                          comment={{ ...m, category: g }}
                          editButtonClick={() => {
                            setEditingCid(m.id);
                          }}
                          setDraggingCid={setDraggingCid}
                          onDrop={() => {
                            console.error(draggingCid);
                            // setDraggingCid((draggingCid) => {
                            if (draggingCid != null) {
                              void (async () => {
                                let newOrder;
                                if (i === 0) {
                                  newOrder = m.order - 1;
                                } else {
                                  newOrder =
                                    (commentsSorted[i - 1].order + m.order) / 2;
                                  console.log(commentsSorted[i - 1].order);
                                  console.log(m.order);
                                }
                                console.log(`${draggingCid} -> ${newOrder}`);
                                const ok = await setCommentOrder({
                                  id: draggingCid,
                                  order: newOrder,
                                });
                                if (ok) {
                                  fetchAll();
                                }
                              })();
                            } else {
                              console.error("draggingCid is null");
                            }
                            //   return null;
                            // });
                          }}
                        />
                      )}
                    </div>
                  ))}
              </List>
            </div>
          ))}
      </Container>
    </DndProvider>
  );
}
