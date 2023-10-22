import * as React from "react";
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import AutoScroller from "components/scroller";
import MenuIcon from "@mui/icons-material/Menu";
import ListIcon from "@mui/icons-material/List";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useRouter } from "next/router";
import { Element as ScrollElement } from "react-scroll";
import { Book, BookInfo, Rule, ApiReturnMsg, Comment } from "lib/types";
import { useApi } from "components/apiprovider";
import { BookItem, BookItemEditing } from "components/bookitem";
import Link from "next/link";

export default function Books() {
  const { books, fetchAll, apiResult, editBook, addBook, deleteBook } =
    useApi();
  const [editingBid, setEditingBid] = useState<null | number>(null);
  const [newName, setNewName] = useState<string>("");
  return (
    <Container sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h5">ルールブック</Typography>
      <List sx={{ width: "100%" }}>
        {books.map((b, i) =>
          b.id === editingBid ? (
            <>
              <BookItemEditing
                key={i}
                book={b}
                editBook={(book: BookInfo) => {
                  void (async () => {
                    const ok = await editBook(book);
                    if (ok) {
                      setEditingBid(null);
                      fetchAll();
                    }
                  })();
                }}
                deleteBook={(book: BookInfo) => {
                  if (
                    confirm(
                      "このルールブックを削除しますか?\n" +
                        `(${book.rulesNum}個のルールと${book.commentsNum}個のコメントが完全に削除されます)`
                    )
                  ) {
                    void (async () => {
                      const ok = await deleteBook(book);
                      if (ok) {
                        setEditingBid(null);
                        fetchAll();
                      }
                    })();
                  }
                }}
              />
              <Divider />
            </>
          ) : (
            <>
              <BookItem
                key={i}
                book={b}
                editButtonClick={() => setEditingBid(b.id)}
              />
              <Divider />
            </>
          )
        )}
      </List>
      <Grid container spacing={1} alignItems="center">
        <Grid item>ルールブックを追加:</Grid>
        <Grid item xs>
          <TextField
            size="small"
            variant="standard"
            placeholder="名前"
            fullWidth
            value={newName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewName(event.target.value);
            }}
          />
        </Grid>
        <Grid item>
          <Button
            size="small"
            color="primary"
            sx={{ ml: 1 }}
            startIcon={<AddCircleIcon />}
            onClick={() => {
              void (async () => {
                const ok = await addBook({ id: 0, name: newName });
                if (ok) {
                  setNewName("");
                  fetchAll();
                }
              })();
            }}
          >
            追加
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
