import { useState } from "react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { useApi } from "components/apiprovider";
import { useRouter } from "next/router";

const pages = [
  { name: "概要", href: "/" },
  { name: "原文", href: "/rulebook" },
  { name: "インポート", href: "/editor" },
  { name: "和訳", href: "/trans" },
  { name: "エクスポート", href: "/export" },
];
const title = "Rule-Reader";

function BookSelect(props: { color?: string }) {
  const { books, currentBook } = useApi();
  const { pathname, query } = useRouter();
  const router = useRouter();
  // const [bookSelect, setBookSelect] = useState<string>("");
  if (pathname === "/books") {
    return null;
  } else {
    return (
      <FormControl sx={{ minWidth: 120 }} size="small">
        <Select
          value={currentBook.name}
          onChange={(event: SelectChangeEvent) => {
            // setBookSelect(event.target.value);
          }}
          sx={{ color: props.color }}
        >
          {books.map((b, i) => (
            <MenuItem
              key={i}
              value={b.name}
              onClick={() => void router.push(pathname + "?book=" + b.name)}
            >
              {b.name}
            </MenuItem>
          ))}
          <MenuItem value="" onClick={() => void router.push("/books")}>
            ルールブックを管理...
          </MenuItem>
        </Select>
      </FormControl>
    );
  }
}

function ResponsiveAppBar() {
  const { pathname, query } = useRouter();
  const { books, currentBook } = useApi();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
    <>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 1,
                display: { xs: "none", md: "flex" },
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <BookSelect color="white" />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pathname !== "/books" && (
                  <MenuItem>
                    <BookSelect />
                  </MenuItem>
                )}
                {pages.map((page) => (
                  <Link key={page.name} href={page.href + "?book=" + currentBook.name} legacyBehavior>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
              }}
            >
              {title}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Link href={page.href  + "?book=" + currentBook.name} key={page.name} legacyBehavior>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ color: "white", display: "block" }}
                  >
                    {page.name}
                  </Button>
                </Link>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
}
export default ResponsiveAppBar;
