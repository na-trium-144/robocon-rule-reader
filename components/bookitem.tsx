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
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { useState, useEffect } from "react";
import { Book } from "lib/types";
import { useDrag, useDrop } from "react-dnd";

export const BookItem = (props: {
  book: Book;
  editButtonClick: () => void;
}) => {
  const { book, editButtonClick } = props;
  return (
    <ListItemButton dense sx={{ cursor: "default" }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <ArticleIcon />
        </Grid>
        <Grid item>
          <Typography variant="h6">{book.name}</Typography>
        </Grid>
        <Grid item>
          <IconButton
            color="primary"
            size="small"
            sx={{ ml: 1, mr: 1 }}
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              editButtonClick();
            }}
          >
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item sx={{ ml: 1.5 }}>
          <DescriptionOutlinedIcon fontSize="small" />
        </Grid>
        <Grid item>
          <Typography variant="body2">{book.rules.length}</Typography>
        </Grid>
        <Grid item sx={{ ml: 1.5 }}>
          <ChatOutlinedIcon fontSize="small" />
        </Grid>
        <Grid item>
          <Typography variant="body2">
            {book.rules.reduce((prev, r) => prev + r.comments.length, 0)}
          </Typography>
        </Grid>
      </Grid>
    </ListItemButton>
  );
};

export const BookItemEditing = (props: {
  book: Book;
  editBook: (book: Book) => void;
}) => {
  const { book, editBook } = props;
  const [text, setText] = useState<string>(book.name);
  return (
    <ListItem dense sx={{ cursor: "default" }}>
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
              editBook({ ...book, rules: [], name: text });
            }}
          >
            <CheckIcon />
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  );
};
