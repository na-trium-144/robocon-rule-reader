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
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import { useState, useEffect, ReactNode } from "react";
import * as React from "react";
import { Element as ScrollElement } from "react-scroll";
import { useApi } from "components/apiprovider";
import { CommentItem, CommentItemEditing } from "components/commentitem";
import { Comment, Category } from "lib/types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export interface CommentDnDTarget {
  category: Category;
  newOrder: number;
}
export interface CategoryDnDTarget {
  newOrder: number;
}

const CategoryHeader = (props: {
  onDrop: undefined | (() => void);
  children: ReactNode;
}) => {
  const { onDrop } = props;
  const dndType = "comment";
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: dndType,
      drop: onDrop || (() => undefined),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [onDrop]
  );
  if (onDrop != undefined) {
    return (
      <div ref={drop}>
        {isOver && <Box sx={{ width: "100%", height: "40px" }} />}
        {props.children}
      </div>
    );
  } else {
    return props.children;
  }
};

export const CategoryItem = (props: {
  category: Category;
  prevCategory: Category | undefined;
  activeCid: number | null;
  editingCid: number | null;
  setEditingCid: (cid: number | null) => void;
  isEditing: boolean;
  setIsEditing: (e: boolean) => void;
  editCategory: (g: Category) => void;
  setDraggingComment: (cid: Comment | null) => void;
  setCommentDrop: (cid: CommentDnDTarget | null) => void;
  startDragging: () => void;
  onDrop: () => void;
}) => {
  const {
    category,
    prevCategory,
    activeCid,
    editingCid,
    setEditingCid,
    isEditing,
    setIsEditing,
    editCategory,
    setDraggingComment,
    setCommentDrop,
    startDragging,
    onDrop,
  } = props;

  // commentitemからこぴぺ
  const dndType = "category";
  const [{ isDragging }, drag] = useDrag(() => ({
    type: dndType,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  useEffect(() => {
    if (isDragging) {
      startDragging();
    }
  }, [isDragging, startDragging]);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: dndType,
      drop: onDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [onDrop]
  );

  const { editComment, fetchAll } = useApi();
  const [hovering, setHovering] = useState<boolean>(false);
  const [text, setText] = useState<string>(category.name);

  return (
    <div ref={drop}>
      {isOver && <Box sx={{ width: "100%", height: "60px" }} />}
      {isEditing ? (
        <Grid container alignItems="center">
          <Grid item xs>
            <TextField
              value={text}
              fullWidth
              variant="standard"
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setText(event.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <IconButton
              color="primary"
              size="small"
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                editCategory({ ...category, name: text });
              }}
            >
              <CheckIcon />
            </IconButton>
          </Grid>
        </Grid>
      ) : (
        <div ref={drag}>
          <CategoryHeader
            onDrop={
              prevCategory == undefined
                ? undefined
                : () => {
                    setCommentDrop({
                      category: prevCategory,
                      newOrder:
                        prevCategory.comments[prevCategory.comments.length - 1]
                          .order + 1,
                    });
                  }
            }
          >
            <Grid
              container
              sx={{
                cursor: "grab",
                background: hovering ? "rgb(240,240,240)" : "inherit",
                height: 32,
              }}
              onMouseOver={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              alignItems="top"
            >
              <Grid item>
                <Typography variant="h6">{category.name}</Typography>
              </Grid>
              {hovering && (
                <Grid item>
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{ ml: 1, mr: 1 }}
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                      setIsEditing(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </CategoryHeader>
        </div>
      )}
      <List sx={{ width: "100%", p: 0 }}>
        {category.comments.map((m, i, a) => (
          <div key={m.id}>
            <ScrollElement id={m.id.toString()} name={m.id.toString()} />
            <CommentItem
              isEditing={editingCid === m.id}
              setIsEditing={(e: boolean) => setEditingCid(e ? m.id : null)}
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
              startDragging={() => {
                setDraggingComment(m);
                setCommentDrop(null);
              }}
              onDrop={() => {
                let newOrder: number;
                if (i === 0) {
                  newOrder = m.order - 1;
                } else {
                  newOrder = (m.order + a[i - 1].order) / 2;
                }
                setCommentDrop({ category, newOrder });
              }}
            />
          </div>
        ))}
      </List>
    </div>
  );
};
