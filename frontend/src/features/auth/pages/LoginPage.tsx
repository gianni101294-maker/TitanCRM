import {
  useState,
  type FormEvent,
} from "react";
import {
  useNavigate,
} from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

import { login } from "../api/auth";

function getLoginErrorMessage(
  error: unknown,
) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            detail?: string;
          };
        };
      }
    ).response;

    if (
      response?.data?.detail
    ) {
      return response.data.detail;
    }
  }

  return "No se pudo iniciar sesión.";
}

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const data = await login(
        email,
        password,
      );

      localStorage.setItem(
        "titancrm_access_token",
        data.access_token,
      );

      localStorage.setItem(
        "titancrm_user",
        JSON.stringify(data.user),
      );

      localStorage.setItem(
        "titancrm_user_role",
        data.user.role,
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        },
      );
    } catch (error) {
      setErrorMessage(
        getLoginErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 3,
              sm: 4,
            },
            "&:last-child": {
              pb: {
                xs: 3,
                sm: 4,
              },
            },
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 800,
              mb: 1,
            }}
          >
            🚀 TitanCRM
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
            sx={{
              mb: 4,
            }}
          >
            Gestión Inteligente de Clientes
          </Typography>

          {errorMessage && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
              }}
            >
              {errorMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              type="email"
              label="Correo electrónico"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              autoComplete="email"
              required
              margin="normal"
              disabled={isLoading}
            />

            <TextField
              fullWidth
              type="password"
              label="Contraseña"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              autoComplete="current-password"
              required
              margin="normal"
              disabled={isLoading}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
                minHeight: 46,
              }}
            >
              {isLoading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}