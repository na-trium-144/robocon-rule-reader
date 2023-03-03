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

const CategoryView = (props: {
  category: Category;
  activeCid: number;
  setActiveCid: (cid: number) => void;
  editingCid: number;
  setEditingCid: (cid: number) => void;
}) => {
  const { category, activeCid, setActiveCid, editingCid, setEditingCid } =
    props;
  const { editComment, fetchAll, setCommentOrder } = useApi();
  const [commentsSorted, setCommentsSorted] = useState<Comment[]>([]);
  useEffect(() => {
    setCommentsSorted(
      category.comments.sort((a, b) =>
        a.order < b.order ? -1 : a.order > b.order ? 1 : 0
      )
    );
  }, [category]);
  const [draggingCid, setDraggingCid] = useState<number | null>(null);
  const [droppedCid, setDroppedCid] = useState<number | null>(null);
  useEffect(() => {
    if (draggingCid != null && droppedCid != null) {
      const droppedCommentIdx = commentsSorted.findIndex(
        (m) => m.id === droppedCid
      );
      const droppedComment = commentsSorted[droppedCommentIdx];
      const previousComment = commentsSorted[droppedCommentIdx - 1];
      void (async () => {
        let newOrder;
        if (previousComment == undefined) {
          newOrder = droppedComment.order - 1;
        } else {
          newOrder = (previousComment.order + droppedComment.order) / 2;
        }
        const ok = await setCommentOrder({
          id: draggingCid,
          order: newOrder,
        });
        if (ok) {
          fetchAll();
        }
      })();
      setDraggingCid(null);
      setDroppedCid(null);
    }
    //   return null;
    // });
  }, [draggingCid, droppedCid, commentsSorted]);
  return (
    <List sx={{ width: "100%" }}>
      {commentsSorted.map((m, i) => (
        <div key={m.id}>
          <ScrollElement id={m.id.toString()} name={m.id.toString()} />
          {editingCid === m.id ? (
            <CommentItemEditing
              isActive={activeCid === m.id}
              comment={{ ...m, category: category }}
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
              comment={{ ...m, category: category }}
              editButtonClick={() => {
                setEditingCid(m.id);
              }}
              startDragging={() => {
                setDraggingCid(m.id);
                setDroppedCid(null);
              }}
              dropped={() => {
                setDroppedCid(m.id);
              }}
            />
          )}
        </div>
      ))}
    </List>
  );
};
export default function Home() {
  const { query } = useRouter();
  const [activeCid, setActiveCid] = useState<number | null>(null);
  const [editingCid, setEditingCid] = useState<number | null>(null);
  const { categories, editComment, fetchAll, setCommentOrder } = useApi();
  useEffect(() => {
    if (typeof query.cid === "string") {
      setActiveCid(parseInt(query.cid));
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
      <Typography variant="body1">ドラッグ&ドロップでコメントを並べ替えできます。</Typography>
      <DndProvider backend={HTML5Backend}>
        {categories
          .sort((a, b) => collator.compare(a.name, b.name))
          .map((g, i) => (
            <div key={g.name}>
              <Typography variant="h6">{g.name}</Typography>
              <CategoryView
                category={g}
                activeCid={activeCid}
                setActiveCid={setActiveCid}
                editingCid={editingCid}
                setEditingCid={setEditingCid}
              />
            </div>
          ))}
      </DndProvider>
    </Container>
  );
}
