import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Rule, Comment } from "lib/types";
import { useDrag, useDrop } from "react-dnd";
import { useApi } from "components/apiprovider";

export const CommentItem = (props: {
  isEditing: boolean;
  setIsEditing: (e: boolean) => void;
  editComment: (comment: Comment) => void;
  isActive: boolean;
  comment: Comment;
  startDragging: () => void;
  dropped: () => void;
}) => {
  const {
    isEditing,
    setIsEditing,
    editComment,
    isActive,
    comment,
    startDragging,
    dropped,
  } = props;

  const dndType = "comment";
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
      drop: dropped, // droppedが変化してもuseDropの中身は変更できないっぽい。
      //なのでここで呼び出す関数はずっと変更されないものにする必要がある
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );
  const [text, setText] = useState<string>(comment.text);
  const { currentBook } = useApi();

  return (
    <div ref={drop}>
      {isOver && <Box sx={{ width: "100%", height: "40px" }} />}
      <ListItemButton dense selected={isActive} sx={{ cursor: "grab" }}>
        <Box ref={drag} sx={{ width: "100%" }}>
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
                    editComment({ ...comment, text: text });
                  }}
                >
                  <CheckIcon />
                </IconButton>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1" component="span">
              <Link
                href={`/rulebook?book=${currentBook.name}&num=${comment.rule.num}`}
              >
                <Button
                  color="secondary"
                  size="small"
                  startIcon={<DescriptionOutlinedIcon />}
                  sx={{ mr: 1, minWidth: 0 }}
                >
                  {comment.rule.num}
                </Button>
              </Link>
              {comment.text}
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
            </Typography>
          )}
        </Box>
      </ListItemButton>
    </div>
  );
};
