import {
  useState,
  type ReactNode,
} from "react";
import { Box } from "@mui/material";

import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

export function DashboardLayout({
  title,
  children,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  function openMobileSidebar() {
    setMobileOpen(true);
  }

  function closeMobileSidebar() {
    setMobileOpen(false);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={closeMobileSidebar}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: {
            xs: "100%",
            md: "calc(100% - 250px)",
          },
        }}
      >
        <Topbar
          title={title}
          onMenuClick={openMobileSidebar}
        />

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}