import type { ReactNode } from "react";

import {
  Assessment,
  CalendarMonth,
  Dashboard,
  Groups,
  Logout,
  ManageAccounts,
  TrendingUp,
  Work,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  PERMISSIONS,
  type Permission,
} from "@/features/auth/permissions";
import {
  usePermissions,
} from "@/features/auth/hooks/usePermissions";

const SIDEBAR_WIDTH = 250;

interface MenuItem {
  label: string;
  path: string;
  icon: ReactNode;
  permission: Permission;
}

interface StoredUser {
  full_name?: string;
  email?: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <Dashboard />,
    permission:
      PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    label: "Clientes",
    path: "/customers",
    icon: <Groups />,
    permission:
      PERMISSIONS.CUSTOMERS_VIEW,
  },
  {
    label: "Oportunidades",
    path: "/opportunities",
    icon: <Work />,
    permission:
      PERMISSIONS.OPPORTUNITIES_VIEW,
  },
  {
    label: "Pipeline",
    path: "/pipeline",
    icon: <TrendingUp />,
    permission:
      PERMISSIONS.PIPELINE_VIEW,
  },
  {
    label: "Actividades",
    path: "/activities",
    icon: <CalendarMonth />,
    permission:
      PERMISSIONS.ACTIVITIES_VIEW,
  },
  {
    label: "Reportes",
    path: "/reports",
    icon: <Assessment />,
    permission:
      PERMISSIONS.REPORTS_VIEW,
  },
  {
    label: "Usuarios",
    path: "/users",
    icon: <ManageAccounts />,
    permission:
      PERMISSIONS.USERS_VIEW,
  },
];

function getStoredUser():
  | StoredUser
  | null {
  const storedValue =
    localStorage.getItem(
      "titancrm_user",
    );

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(
      storedValue,
    ) as StoredUser;
  } catch {
    return null;
  }
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    can,
    role,
  } = usePermissions();

  const user = getStoredUser();

  const visibleMenuItems =
    menuItems.filter((item) =>
      can(item.permission),
    );

  function handleNavigate(
    path: string,
  ) {
    navigate(path);
    onMobileClose();
  }

  function handleLogout() {
    localStorage.removeItem(
      "titancrm_access_token",
    );

    localStorage.removeItem(
      "titancrm_user",
    );

    localStorage.removeItem(
      "titancrm_user_role",
    );

    onMobileClose();

    navigate(
      "/login",
      {
        replace: true,
      },
    );
  }

  const sidebarContent = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        minHeight: "100%",
        bgcolor: "#111827",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          px: 2.5,
        }}
      >
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            🚀 TitanCRM
          </Typography>

          {user?.full_name && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.25,
                color:
                  "rgba(255, 255, 255, 0.85)",
                overflow: "hidden",
                textOverflow:
                  "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.full_name}
            </Typography>
          )}

          <Typography
            variant="caption"
            sx={{
              display: "block",
              color:
                "rgba(255, 255, 255, 0.6)",
              textTransform:
                "capitalize",
            }}
          >
            Rol: {role ?? "Sin sesión"}
          </Typography>
        </Box>
      </Toolbar>

      <Divider
        sx={{
          borderColor:
            "rgba(255, 255, 255, 0.12)",
        }}
      />

      <List
        sx={{
          flexGrow: 1,
          px: 1.25,
          py: 1.5,
        }}
      >
        {visibleMenuItems.map(
          (item) => {
            const isSelected =
              location.pathname ===
              item.path;

            return (
              <ListItemButton
                key={item.path}
                selected={
                  isSelected
                }
                onClick={() =>
                  handleNavigate(
                    item.path,
                  )
                }
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  minHeight: 48,
                  color:
                    "rgba(255, 255, 255, 0.82)",

                  "& .MuiListItemIcon-root":
                    {
                      color:
                        "inherit",
                    },

                  "&.Mui-selected": {
                    bgcolor:
                      "rgba(37, 99, 235, 0.28)",
                    color:
                      "white",
                  },

                  "&.Mui-selected:hover":
                    {
                      bgcolor:
                        "rgba(37, 99, 235, 0.36)",
                    },

                  "&:hover": {
                    bgcolor:
                      "rgba(255, 255, 255, 0.08)",
                    color:
                      "white",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={
                    item.label
                  }
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight:
                          isSelected
                            ? 700
                            : 500,
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
          },
        )}
      </List>

      <Divider
        sx={{
          borderColor:
            "rgba(255, 255, 255, 0.12)",
        }}
      />

      <List
        sx={{
          px: 1.25,
          py: 1.5,
        }}
      >
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            minHeight: 48,
            color:
              "rgba(255, 255, 255, 0.82)",

            "& .MuiListItemIcon-root":
              {
                color:
                  "inherit",
              },

            "&:hover": {
              bgcolor:
                "rgba(239, 68, 68, 0.18)",
              color:
                "white",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 42,
            }}
          >
            <Logout />
          </ListItemIcon>

          <ListItemText
            primary="Cerrar sesión"
            slotProps={{
              primary: {
                sx: {
                  fontWeight: 500,
                },
              },
            }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      aria-label="Navegación principal"
      sx={{
        width: {
          md: SIDEBAR_WIDTH,
        },
        flexShrink: {
          md: 0,
        },
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width:
              SIDEBAR_WIDTH,
            boxSizing:
              "border-box",
            border: 0,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          "& .MuiDrawer-paper": {
            width:
              SIDEBAR_WIDTH,
            boxSizing:
              "border-box",
            border: 0,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </Box>
  );
}