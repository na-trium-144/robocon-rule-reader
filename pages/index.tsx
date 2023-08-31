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
import { CategoryItem } from "components/categoryitem";

export default function Home() {
  const { query } = useRouter();
  // Aid: categoryのid, Cid: commentのid

  // スクロール先のコメント (query変化したらセット)
  const [scrollTo, setScrollTo] = useState<number | null>(null);
  // AutoScrollerに渡す値 (commentsの読み込み完了したらセット)
  const [activeCid, setActiveCid] = useState<number | null>(null);
  // 編集中のコメント
  const [editingCid, setEditingCid] = useState<number | null>(null);
  const [editingAid, setEditingAid] = useState<number | null>(null);

  const {
    currentBook,
    categories,
    editComment,
    fetchAll,
    editCategory,
    deleteComment,
  } = useApi();

  useEffect(() => {
    if (typeof query.cid === "string") {
      setScrollTo(parseInt(query.cid));
    }
  }, [query]);
  useEffect(() => {
    if (scrollTo != null && categories.length > 0) {
      setActiveCid(scrollTo);
      setScrollTo(null);
    }
  }, [scrollTo, categories]);

  const [categoriesSorted, setCategoriesSorted] = useState<Category[]>([]);
  useEffect(() => {
    const categoriesSorted = categories
      .sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0))
      .filter((c) => c.comments.length > 0);
    for (const g of categoriesSorted) {
      g.comments = g.comments.sort((a, b) =>
        a.order < b.order ? -1 : a.order > b.order ? 1 : 0
      );
    }
    setCategoriesSorted(categoriesSorted);
  }, [categories]);
  const [draggingAid, setDraggingAid] = useState<number | null>(null);
  const [droppedAid, setDroppedAid] = useState<number | null>(null);
  useEffect(() => {
    if (draggingAid != null && droppedAid != null) {
      const draggingCategory = categoriesSorted.find(
        (m) => m.id === draggingAid
      ) as Category;
      const droppedCategoryIdx = categoriesSorted.findIndex(
        (m) => m.id === droppedAid
      );
      const droppedCategory = categoriesSorted[droppedCategoryIdx];
      const previousCategory = categoriesSorted[droppedCategoryIdx - 1];
      void (async () => {
        let newOrder;
        if (previousCategory == undefined) {
          newOrder = droppedCategory.order - 1;
        } else {
          newOrder = (previousCategory.order + droppedCategory.order) / 2;
        }
        const ok = await editCategory({
          ...draggingCategory,
          order: newOrder,
          comments: [],
        });
        if (ok) {
          fetchAll();
        }
      })();
      setDraggingAid(null);
      setDroppedAid(null);
    }
    //   return null;
    // });
  }, [draggingAid, droppedAid, fetchAll, categoriesSorted, editCategory]);

  const [draggingCid, setDraggingCid] = useState<number | null>(null);
  const [droppedCid, setDroppedCid] = useState<number | null>(null);
  useEffect(() => {
    if (draggingCid != null && droppedCid != null) {
      let draggingComment: Comment | null = null;
      let droppedCategory: Category | null = null;
      let droppedCommentIdx: number | null = null;
      for (const g of categoriesSorted) {
        draggingComment =
          draggingComment || g.comments.find((m) => m.id === draggingCid);
        const i = g.comments.findIndex((m) => m.id === droppedCid);
        if (i >= 0) {
          droppedCategory = g;
          droppedCommentIdx = i;
        }
      }
      const droppedComment =
        droppedCategory.comments[droppedCommentIdx as number];
      const previousComment =
        droppedCategory.comments[(droppedCommentIdx as number) - 1];
      let newOrder;
      if (previousComment == undefined) {
        newOrder = droppedComment.order - 1;
      } else {
        newOrder = (previousComment.order + droppedComment.order) / 2;
      }
      void (async () => {
        const ok = await editComment({
          ...draggingComment,
          category: { ...droppedCategory, comments: [] },
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
  }, [draggingCid, droppedCid, categoriesSorted, fetchAll, editComment]);

  return (
    <Container
      onClick={() => {
        setActiveCid(null);
        setEditingCid(null);
        setEditingAid(null);
      }}
    >
      <AutoScroller id={activeCid == null ? null : activeCid.toString()} />
      <Typography variant="h5">
        ルール概要、コメント ({currentBook.name})
      </Typography>
      <Typography variant="body1">
        新規ルール・コメントの追加は「インポート」ページから、
        <br />
        既存ルールへのコメントの追加は「原文」ページからできます。
        <br />
        ドラッグ&ドロップでコメントを並べ替えできます。
      </Typography>
      <DndProvider backend={HTML5Backend}>
        {categories
          .sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0))
          .filter((c) => c.comments.length > 0)
          .map((g) => (
            <CategoryItem
              key={g.id}
              category={g}
              activeCid={activeCid}
              editingCid={editingCid}
              setEditingCid={(cid: number | null) => {
                setEditingCid(cid);
                setEditingAid(null);
              }}
              isEditing={editingAid === g.id}
              setIsEditing={(e: boolean) => {
                setEditingAid(e ? g.id : null);
                setEditingCid(null);
              }}
              editCategory={(category: Category) => {
                void (async () => {
                  const ok = await editCategory({ ...category, comments: [] });
                  if (ok) {
                    setEditingAid(null);
                    fetchAll();
                  }
                })();
              }}
              setDraggingCid={setDraggingCid}
              setDroppedCid={setDroppedCid}
              startDragging={() => {
                setDraggingAid(g.id);
                setDroppedAid(null);
              }}
              dropped={() => {
                setDroppedAid(g.id);
              }}
            />
          ))}
      </DndProvider>
    </Container>
  );
}
