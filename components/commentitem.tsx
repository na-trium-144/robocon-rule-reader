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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InputAdornment from "@mui/material/InputAdornment";
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
  onDrop: () => void;
}) => {
  const {
    isEditing,
    setIsEditing,
    editComment,
    isActive,
    comment,
    startDragging,
    onDrop,
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
      drop: onDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [onDrop]
  );
  const [text, setText] = useState<string>(comment.text);
  const [extName, setExtName] = useState<string>(comment.externalName || "");
  const [extLink, setExtLink] = useState<string>(comment.externalLink || "");
  const [hasLink, setHasLink] = useState<boolean>(
    comment.externalLink != "" && comment.externalLink != null
  );
  const { currentBook } = useApi();
  const [hovering, setHovering] = useState<boolean>(false);
  const send = () => {
    editComment({
      ...comment,
      text: text,
      externalLink: hasLink ? extLink : null,
      externalName: hasLink ? extName : null,
    });
  };

  return (
    <div ref={drop}>
      {isOver && <Box sx={{ width: "100%", height: "40px" }} />}
      {isEditing ? (
        <ListItem
          dense
          selected={isActive}
          sx={{ height: hasLink ? 80 : 32 }}
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
          }}
        >
          <Grid container alignItems="center">
            <Grid item>
              <Checkbox
                color="success"
                icon={<OpenInNewIcon />}
                checkedIcon={<OpenInNewIcon />}
                checked={hasLink}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setHasLink(event.target.checked);
                }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                value={text}
                fullWidth
                variant="standard"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setText(event.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <IconButton color="primary" size="small" onClick={send}>
                <CheckIcon />
              </IconButton>
            </Grid>
            {hasLink && (
              <>
                <Grid item xs={12} />
                <Grid item></Grid>
                <Grid item xs={4} sm={2} md={1.5} lg={1} sx={{ px: 1 }}>
                  <TextField
                    value={extName}
                    fullWidth
                    size="small"
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setExtName(event.target.value);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <OpenInNewIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    value={extLink}
                    fullWidth
                    size="small"
                    placeholder="URL"
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setExtLink(event.target.value);
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </ListItem>
      ) : (
        <ListItemButton
          dense
          selected={isActive}
          sx={{ cursor: "grab", height: 32 }}
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
          }}
        >
          <Box
            ref={drag}
            sx={{ width: "100%" }}
            onMouseOver={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <Typography variant="body1" component="span">
              {comment.rule != null && (
                <Link
                  href={`/rulebook?book=${currentBook.name}&num=${comment.rule.num}`}
                >
                  <Button
                    color="secondary"
                    size="small"
                    startIcon={<DescriptionOutlinedIcon />}
                    sx={{ mr: 1, minWidth: 0, textTransform: "none" }}
                  >
                    {comment.rule.num}
                  </Button>
                </Link>
              )}
              {comment.externalName != null && comment.externalLink != null && (
                <a href={comment.externalLink} target="_blank" rel="noreferrer">
                  <Button
                    color="success"
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    sx={{ mr: 1, minWidth: 0, textTransform: "none" }}
                  >
                    {comment.externalName}
                  </Button>
                </a>
              )}
              {comment.text}
              {hovering && (
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
              )}
            </Typography>
          </Box>
        </ListItemButton>
      )}
    </div>
  );
};
