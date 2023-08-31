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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const CategoryItem = (props: {
  category: Category;
  activeCid: number | null;
  editingCid: number | null;
  setEditingCid: (cid: number | null) => void;
  setDraggingCid: (cid: number | null) => void;
  setDroppedCid: (cid: number | null) => void;
  startDragging: () => void;
  dropped: () => void;
}) => {
  const {
    category,
    activeCid,
    editingCid,
    setEditingCid,
    setDraggingCid,
    setDroppedCid,
    startDragging,
    dropped,
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
      drop: dropped,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  const { editComment, fetchAll, setCommentOrder } = useApi();

  const [hovering, setHovering] = useState<boolean>(false);
  return (
    <div ref={drop}>
      {isOver && <Box sx={{ width: "100%", height: "60px" }} />}
      <div ref={drag}>
        <div
          style={{
            cursor: "grab",
            background: hovering ? "rgb(240,240,240)" : "inherit",
          }}
          onMouseOver={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Typography variant="h6">{category.name}</Typography>
        </div>
        <List sx={{ width: "100%" }}>
          {category.comments.map((m) => (
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
      </div>
    </div>
  );
};
