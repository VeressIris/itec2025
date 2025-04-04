import React from "react";
import Link from "next/link";
import { Menu as MenuIcon, Message as MessageIcon } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

const title = "BrainCircle";

const pages = [
  { label: "Events of the month", href: "/events/events-of-the-month" },
];

const settings = [
  { label: "My Profile", href: "/profile" },
  { label: "My Projects", href: "/profile/projects" },
  { label: "My Friends", href: "/friends" },
];

export default function Navbar(): React.ReactElement {
  const { signOut, redirectToSignIn, user } = useClerk();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundImage: "linear-gradient(to right, #ca5a29, #a31755)",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              flex: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
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
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.label}
                  component={Link}
                  href={page.href}
                  onClick={handleCloseNavMenu}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {page.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component={Link}
            href="/"
            sx={{
              display: { xs: "flex", md: "none" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.label}
                href={page.href}
                component={Link}
                onClick={handleCloseNavMenu}
                color="inherit"
              >
                {page.label}
              </Button>
            ))}
          </Box>

          <Stack
            direction="row"
            gap={1}
            justifyContent="right"
            flex={{ xs: 1, md: 0 }}
          >
            <SignedIn>
              <Tooltip title="Messages">
                <IconButton component={Link} href="/messages">
                  <MessageIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src={user?.imageUrl} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.label}
                    onClick={handleCloseUserMenu}
                    href={setting.href}
                    component={Link}
                  >
                    {setting.label}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={() => signOut()}>Logout</MenuItem>
              </Menu>
            </SignedIn>
            <SignedOut>
              <Button
                onClick={() => redirectToSignIn()}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  whiteSpace: "nowrap",
                }}
              >
                Sign In
              </Button>
            </SignedOut>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
