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
import {
  CategoryItem,
  CategoryDnDTarget,
  CommentDnDTarget,
} from "components/categoryitem";

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

  const [draggingCategory, setDraggingCategory] = useState<Category | null>(
    null
  );
  const [categoryDrop, setCategoryDrop] = useState<CategoryDnDTarget | null>(
    null
  );
  useEffect(() => {
    if (draggingCategory != null && categoryDrop != null) {
      void (async () => {
        const ok = await editCategory({
          ...draggingCategory,
          order: categoryDrop.newOrder,
          comments: [],
        });
        if (ok) {
          fetchAll();
        }
      })();
      setDraggingCategory(null);
      setCategoryDrop(null);
    }
  }, [draggingCategory, categoryDrop, fetchAll, editCategory]);

  const [draggingComment, setDraggingComment] = useState<Comment | null>(null);
  const [commentDrop, setCommentDrop] = useState<CommentDnDTarget | null>(null);
  useEffect(() => {
    if (draggingComment != null && commentDrop != null) {
      console.log(commentDrop);
      void (async () => {
        const ok = await editComment({
          ...draggingComment,
          category: { ...commentDrop.category, comments: [] },
          order: commentDrop.newOrder,
        });
        if (ok) {
          fetchAll();
        }
      })();
      setDraggingComment(null);
      setCommentDrop(null);
    }
  }, [draggingComment, commentDrop, fetchAll, editComment]);

  const newCategory = {
    id: -1,
    name: "(新しいカテゴリー)",
    order: categories.reduce((o, g) => (g.order > o ? g.order : o), 0),
    comments: [
      {
        id: -1,
        text: "",
        order: 0,
        rule: { num: "" },
      },
    ],
  };
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
      <Typography variant="body1" sx={{ mb: 1 }}>
        新規ルール・コメントの追加は「インポート」ページから、
        <br />
        既存ルールへのコメントの追加は「原文」ページからできます。
        <br />
        ドラッグ&ドロップでコメントを並べ替えできます。
      </Typography>
      <DndProvider backend={HTML5Backend}>
        {categories.map((g, i, a) => (
          <CategoryItem
            key={g.id}
            category={g}
            prevCategory={a[i - 1]}
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
            setDraggingComment={setDraggingComment}
            setCommentDrop={setCommentDrop}
            startDragging={() => {
              setDraggingCategory(g);
              setCategoryDrop(null);
            }}
            onDrop={() => {
              let newOrder: number;
              if (i === 0) {
                newOrder = g.order - 1;
              } else {
                newOrder = (g.order + a[i - 1].order) / 2;
              }
              setCategoryDrop({ newOrder });
            }}
          />
        ))}
        {draggingComment != null && (
          <div style={{ opacity: "30%" }}>
            <CategoryItem
              category={newCategory}
              prevCategory={categories[categories.length - 1]}
              activeCid={null}
              editingCid={null}
              setEditingCid={() => undefined}
              isEditing={false}
              setIsEditing={() => undefined}
              editCategory={() => undefined}
              setDraggingComment={() => undefined}
              setCommentDrop={setCommentDrop}
              startDragging={() => undefined}
              onDrop={() => undefined}
            />
          </div>
        )}
      </DndProvider>
    </Container>
  );
}
