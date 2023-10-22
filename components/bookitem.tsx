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
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from "react";
import { Book, BookInfo } from "lib/types";
import { useDrag, useDrop } from "react-dnd";

export const BookItem = (props: {
  book: BookInfo;
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
        <Grid item>
          <Link href={`/rulebook?book=${book.name}`}>
            <Button
              onClick={() => undefined}
              color="secondary"
              size="small"
              startIcon={<DescriptionOutlinedIcon fontSize="small" />}
            >
              {book.rulesNum}
            </Button>
          </Link>
          <Link href={`/?book=${book.name}`}>
            <Button
              onClick={() => undefined}
              color="secondary"
              size="small"
              startIcon={<ChatOutlinedIcon fontSize="small" />}
            >
              {book.commentsNum}
            </Button>
          </Link>
        </Grid>
      </Grid>
    </ListItemButton>
  );
};

export const BookItemEditing = (props: {
  book: BookInfo;
  editBook: (book: BookInfo) => void;
  deleteBook: (book: BookInfo) => void;
}) => {
  const { book, editBook, deleteBook } = props;
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
              editBook({ ...book, name: text });
            }}
          >
            <CheckIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            color="error"
            size="small"
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              deleteBook({ ...book });
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  );
};
