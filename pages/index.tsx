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
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
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
  checkedCids: number[];
  setCheckedCids: (cids: number[]) => void;
  isEditingMode: boolean;
}) => {
  const {
    category,
    activeCid,
    setActiveCid,
    editingCid,
    setEditingCid,
    checkedCids,
    setCheckedCids,
    isEditingMode,
  } = props;
  const { editComment, fetchAll, setCommentOrder } = useApi();
  const [commentsSorted, setCommentsSorted] = useState<Comment[]>([]);
  useEffect(() => {
    setCommentsSorted(
      category.comments.sort((a, b) =>
        a.order < b.order ? -1 : a.order > b.order ? 1 : 0
      ) as Comment[]
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
    <>
      <div>
        {isEditingMode ? (
          <Button
            variant="text"
            sx={{ minWidth: 0 }}
            onClick={() => {
              if (
                category.comments.findIndex(
                  (m) => checkedCids.indexOf(m.id) >= 0
                ) >= 0
              ) {
                // ぜんぶチェック外す
                setCheckedCids(
                  checkedCids.filter(
                    (cid) =>
                      category.comments.findIndex((m) => cid === m.id) === -1
                  )
                );
              } else {
                // ぜんぶチェック外してからぜんぶつける
                setCheckedCids(
                  checkedCids
                    .filter(
                      (cid) =>
                        category.comments.findIndex((m) => cid === m.id) === -1
                    )
                    .concat(category.comments.map((m) => m.id))
                );
              }
            }}
          >
            <Typography variant="h6">{category.name}</Typography>
          </Button>
        ) : (
          <Typography variant="h6">{category.name}</Typography>
        )}
      </div>
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
                checked={checkedCids.indexOf(m.id) >= 0}
                setChecked={(checked: bool) => {
                  if (checked && checkedCids.indexOf(m.id) === -1) {
                    setCheckedCids(checkedCids.concat([m.id]));
                  }
                  if (!checked) {
                    setCheckedCids(checkedCids.filter((cid) => cid !== m.id));
                  }
                }}
                isEditingMode={isEditingMode}
              />
            )}
          </div>
        ))}
      </List>
    </>
  );
};
export default function Home() {
  const { query } = useRouter();
  const [activeCid, setActiveCid] = useState<number | null>(null);
  const [editingCid, setEditingCid] = useState<number | null>(null);
  const [checkedCids, setCheckedCids] = useState<number[]>([]);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [isCategoryMovingMode, setIsCategoryMovingMode] = useState<boolean>(false);
  const [categoryMovingName, setCategoryMovingName] = useState<string>("");
  useEffect(() => {
    if (!isEditingMode) {
      setCheckedCids([]);
      setIsCategoryMovingMode(false);
    }
    if (!isCategoryMovingMode) {
      setCategoryMovingName("");
    }
  }, [isEditingMode, isCategoryMovingMode]);
  const { categories, editComment, fetchAll, setCommentOrder, deleteComment } =
    useApi();
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
      <Typography variant="body1">
        新規ルール・コメントの追加は「インポート」ページから、<br />
        既存ルールへのコメントの追加は「原文」ページからできます。<br />
        ドラッグ&ドロップでコメントを並べ替えできます。
      </Typography>
      <div>
      <ButtonGroup variant={isEditingMode ? "contained" : "outlined"}>
        <Button
          onClick={() => {
            setIsEditingMode(!isEditingMode);
          }}
        >
          コメントを選択...
        </Button>
        {isEditingMode && (
          <>
            <Button
              onClick={() => {
                setIsCategoryMovingMode(!isCategoryMovingMode);
              }}
            >
              別のカテゴリに移動
            </Button>
            <Button
              onClick={() => {
                const allComments = categories.reduce(
                  (prev, cat) => prev.concat(cat.comments),
                  []
                );
                for (const cid of checkedCids) {
                  const c = allComments.find((c) => c.id === cid);
                  void (async () => {
                    const ok = await deleteComment(c);
                    if (ok) {
                      setIsEditingMode(false);
                      fetchAll();
                    }
                  })();
                }
              }}
            >
              コメントを削除
            </Button>
          </>
        )}
      </ButtonGroup>
      </div>
      {isCategoryMovingMode && (
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <TextField
              variant="standard"
              size="small"
              placeholder="移動先のカテゴリ名"
              value={categoryMovingName}
              onChange={(e) => {
                setCategoryMovingName(e.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                const allComments = categories.reduce(
                  (prev, cat) => prev.concat(cat.comments),
                  []
                );
                for (const cid of checkedCids) {
                  const c = allComments.find((c) => c.id === cid) as Comment;
                  void (async () => {
                    const ok = await editComment({
                      ...c,
                      category: { name: categoryMovingName, id: 0, comments: [] },
                    });
                    if (ok) {
                      setIsEditingMode(false);
                      fetchAll();
                    }
                  })();
                }
              }}
              variant="text"
            >
              移動
            </Button>
          </Grid>
        </Grid>
      )}
      <DndProvider backend={HTML5Backend}>
        {categories
          .sort((a, b) => collator.compare(a.name, b.name))
          .map((g, i) => (
            <CategoryView
              key={g.name}
              category={g}
              activeCid={activeCid}
              setActiveCid={setActiveCid}
              editingCid={editingCid}
              setEditingCid={setEditingCid}
              checkedCids={checkedCids}
              setCheckedCids={setCheckedCids}
              isEditingMode={isEditingMode}
            />
          ))}
      </DndProvider>
    </Container>
  );
}
