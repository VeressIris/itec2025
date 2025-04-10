import { useState, MouseEvent } from "react";
import Link from "next/link";
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

const pages = [{ label: "Upcoming Events", href: "/events/upcoming-events" }];

const settings = [
  { label: "My Profile", href: "/profile" },
  { label: "My Events", href: "/events/my-events" },
  { label: "My Curriculum", href: "/curricula/my-curricula" },
];

export default function Navbar() {
  const { signOut, redirectToSignIn, user } = useClerk();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
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
        backgroundImage:
          "linear-gradient(to right, rgb(70, 23, 163), rgb(138, 41, 202))",
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
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {title}
          </Typography>

          <Box sx={{ flex: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              {/* Menu icon removed */}
              ☰
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
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
                  sx={{ color: "white" }}
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
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              flexGrow: 1,
            }}
          >
            {title}
          </Typography>

          <Box sx={{ flex: 1, display: { xs: "none", md: "flex" } }}>
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
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src={user?.imageUrl} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.label}
                    onClick={handleCloseUserMenu}
                    href={setting.href}
                    component={Link}
                    sx={{ color: "white" }}
                  >
                    {setting.label}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem sx={{ color: "white" }} onClick={() => signOut()}>
                  Logout
                </MenuItem>
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
