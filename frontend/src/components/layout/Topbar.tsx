import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from "react";
import {
  AccountCircle,
  Menu as MenuIcon,
  NotificationsNone,
  Search,
  Today,
  WarningAmber,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  getActivities,
  type Activity,
} from "@/features/activities";
import { GlobalSearchDialog } from "@/features/search";
import { SearchBar } from "@/features/search";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

function isSameLocalDay(
  firstDate: Date,
  secondDate: Date,
) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function formatNotificationDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function Topbar({
  title,
  onMenuClick,
}: TopbarProps) {
  const navigate = useNavigate();

  const [activities, setActivities] = useState<
    Activity[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [notificationAnchor, setNotificationAnchor] =
    useState<HTMLElement | null>(null);

  const [isSearchOpen, setIsSearchOpen] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      try {
        const activityData = await getActivities();

        if (isMounted) {
          setActivities(activityData);
          setLoadError(false);
        }
      } catch {
        if (isMounted) {
          setLoadError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadNotifications();

    const intervalId = window.setInterval(() => {
      void loadNotifications();
    }, 60_000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    function handleKeyboardShortcut(
      event: KeyboardEvent,
    ) {
      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k";

      if (!isSearchShortcut) {
        return;
      }

      event.preventDefault();

      setIsSearchOpen((currentValue) => {
        return !currentValue;
      });
    }

    window.addEventListener(
      "keydown",
      handleKeyboardShortcut,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboardShortcut,
      );
    };
  }, []);

  const pendingActivities = useMemo(
    () =>
      activities
        .filter(
          (activity) =>
            activity.status === "pending",
        )
        .sort(
          (firstActivity, secondActivity) =>
            new Date(
              firstActivity.scheduled_at,
            ).getTime() -
            new Date(
              secondActivity.scheduled_at,
            ).getTime(),
        ),
    [activities],
  );

  const overdueActivities = useMemo(() => {
    const now = new Date();

    return pendingActivities.filter((activity) => {
      const scheduledDate = new Date(
        activity.scheduled_at,
      );

      return (
        !Number.isNaN(scheduledDate.getTime()) &&
        scheduledDate.getTime() < now.getTime() &&
        !isSameLocalDay(scheduledDate, now)
      );
    });
  }, [pendingActivities]);

  const todayActivities = useMemo(() => {
    const now = new Date();

    return pendingActivities.filter((activity) => {
      const scheduledDate = new Date(
        activity.scheduled_at,
      );

      return (
        !Number.isNaN(scheduledDate.getTime()) &&
        isSameLocalDay(scheduledDate, now)
      );
    });
  }, [pendingActivities]);

  const upcomingActivities = useMemo(() => {
    const now = new Date();

    return pendingActivities.filter((activity) => {
      const scheduledDate = new Date(
        activity.scheduled_at,
      );

      return (
        !Number.isNaN(scheduledDate.getTime()) &&
        scheduledDate.getTime() > now.getTime() &&
        !isSameLocalDay(scheduledDate, now)
      );
    });
  }, [pendingActivities]);

  function openSearch() {
    setIsSearchOpen(true);
  }

  function closeSearch() {
    setIsSearchOpen(false);
  }

  function openNotifications(
    event: MouseEvent<HTMLElement>,
  ) {
    setNotificationAnchor(event.currentTarget);
  }

  function closeNotifications() {
    setNotificationAnchor(null);
  }

  function goToActivities() {
    closeNotifications();
    navigate("/activities");
  }

  function renderActivityItem(
    activity: Activity,
    type: "overdue" | "today" | "upcoming",
  ) {
    const icon =
      type === "overdue" ? (
        <WarningAmber color="error" />
      ) : (
        <Today
          color={
            type === "today"
              ? "warning"
              : "primary"
          }
        />
      );

    return (
      <MenuItem
        key={activity.id}
        onClick={goToActivities}
        sx={{
          py: 1.25,
          alignItems: "flex-start",
          whiteSpace: "normal",
        }}
      >
        <ListItemIcon sx={{ mt: 0.25 }}>
          {icon}
        </ListItemIcon>

        <ListItemText
          primary={activity.title}
          secondary={
            <>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                {formatNotificationDate(
                  activity.scheduled_at,
                )}
              </Typography>

              {activity.description && (
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 0.25,
                  }}
                >
                  {activity.description}
                </Typography>
              )}
            </>
          }
          slotProps={{
            primary: {
              sx: {
                fontWeight: 700,
              },
            },
          }}
        />
      </MenuItem>
    );
  }

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 1100,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 64,
            sm: 72,
          },
          px: {
            xs: 1.5,
            sm: 3,
          },
          gap: {
            xs: 0.5,
            sm: 1,
          },
        }}
      >
        <Tooltip title="Abrir menú">
          <IconButton
            aria-label="Abrir menú de navegación"
            edge="start"
            onClick={onMenuClick}
            sx={{
              display: {
                xs: "inline-flex",
                md: "none",
              },
              mr: {
                xs: 0.5,
                sm: 1,
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            noWrap
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "1.1rem",
                sm: "1.5rem",
              },
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            Gestiona tu operación comercial
          </Typography>
        </Box>

        <Box
          sx={{
            display: {
              xs: "none",
              lg: "block",
            },
            mr: 1,
          }}
        >
          <SearchBar onClick={openSearch} />
        </Box>

        <Tooltip title="Buscar">
          <IconButton
            aria-label="Abrir búsqueda global"
            onClick={openSearch}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <Search />
          </IconButton>
        </Tooltip>

        <Tooltip title="Notificaciones">
          <IconButton
            aria-label="Notificaciones"
            onClick={openNotifications}
            aria-controls={
              notificationAnchor
                ? "notifications-menu"
                : undefined
            }
            aria-haspopup="true"
            aria-expanded={
              notificationAnchor
                ? "true"
                : undefined
            }
          >
            <Badge
              badgeContent={pendingActivities.length}
              color={
                overdueActivities.length > 0
                  ? "error"
                  : "primary"
              }
              max={99}
            >
              <NotificationsNone />
            </Badge>
          </IconButton>
        </Tooltip>

        <Avatar
          sx={{
            ml: {
              xs: 0.5,
              sm: 1.5,
            },
            width: {
              xs: 36,
              sm: 40,
            },
            height: {
              xs: 36,
              sm: 40,
            },
            bgcolor: "primary.main",
          }}
        >
          <AccountCircle />
        </Avatar>

        <Menu
          id="notifications-menu"
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={closeNotifications}
          slotProps={{
            paper: {
              sx: {
                width: {
                  xs: "calc(100vw - 24px)",
                  sm: 380,
                },
                maxWidth: 380,
                maxHeight: {
                  xs: "calc(100vh - 90px)",
                  sm: 520,
                },
                mt: 1,
                borderRadius: 2,
              },
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800 }}>
                Notificaciones
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {pendingActivities.length} actividades
                pendientes
              </Typography>
            </Box>

            {isLoading && (
              <CircularProgress size={20} />
            )}
          </Box>

          <Divider />

          {loadError && (
            <Box sx={{ px: 2, py: 2 }}>
              <Typography
                variant="body2"
                color="error.main"
              >
                No se pudieron cargar las notificaciones.
              </Typography>
            </Box>
          )}

          {!isLoading &&
            !loadError &&
            pendingActivities.length === 0 && (
              <Box
                sx={{
                  px: 2,
                  py: 4,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  Todo está al día
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  No tienes actividades pendientes.
                </Typography>
              </Box>
            )}

          {overdueActivities.length > 0 && (
            <>
              <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                <Typography
                  variant="caption"
                  color="error.main"
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Vencidas ({overdueActivities.length})
                </Typography>
              </Box>

              {overdueActivities
                .slice(0, 4)
                .map((activity) =>
                  renderActivityItem(
                    activity,
                    "overdue",
                  ),
                )}
            </>
          )}

          {todayActivities.length > 0 && (
            <>
              <Divider />

              <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                <Typography
                  variant="caption"
                  color="warning.main"
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Para hoy ({todayActivities.length})
                </Typography>
              </Box>

              {todayActivities
                .slice(0, 4)
                .map((activity) =>
                  renderActivityItem(
                    activity,
                    "today",
                  ),
                )}
            </>
          )}

          {upcomingActivities.length > 0 && (
            <>
              <Divider />

              <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  Próximas
                </Typography>
              </Box>

              {upcomingActivities
                .slice(0, 4)
                .map((activity) =>
                  renderActivityItem(
                    activity,
                    "upcoming",
                  ),
                )}
            </>
          )}

          {pendingActivities.length > 0 && (
            <>
              <Divider />

              <MenuItem
                onClick={goToActivities}
                sx={{
                  justifyContent: "center",
                  py: 1.5,
                  color: "primary.main",
                  fontWeight: 700,
                }}
              >
                Ver todas las actividades
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>

      <GlobalSearchDialog
        open={isSearchOpen}
        onClose={closeSearch}
      />
    </AppBar>
  );
}