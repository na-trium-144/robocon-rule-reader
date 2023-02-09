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
import Link from "next/link";
import AutoScroller from "components/scroller";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import * as React from "react";
import { Element as ScrollElement } from "react-scroll";
import { useApi } from "components/apiprovider";

export default function Home() {
  const { query } = useRouter();
  const [activeCid, setActiveCid] = useState<string | undefined>();
  const [clickedCid, setClickedCid] = useState<string | undefined>();
  const { categories } = useApi();
  useEffect(() => {
    setActiveCid(query.cid);
  }, [query]);

  return (
    <Container
      onClick={() => {
        setActiveCid();
      }}
    >
      <AutoScroller id={query.cid} />
      <Typography variant="h5">ルール概要、コメント</Typography>
      {categories.map((g, i) => (
        <>
          <Typography variant="h6">{g.name}</Typography>
          <List sx={{ width: "100%" }}>
            {g.comments.map((m, i) => (
              <>
                <ScrollElement id={m.id.toString()} />
                <ListItemButton
                  dense
                  selected={activeCid === m.id.toString()}
                  sx={{ cursor: "default" }}
                >
                  <Grid container alignItems="baseline" spacing={1}>
                    <Grid item>
                      <Typography variant="body1">{m.text}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1">
                        <Link href={`/rulebook?num=${m.rule.num}`}>
                          ({m.rule.num})
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItemButton>
              </>
            ))}
          </List>
        </>
      ))}
    </Container>
  );
}
