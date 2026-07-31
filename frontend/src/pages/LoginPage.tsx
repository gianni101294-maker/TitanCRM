import { useState, type FormEvent } from "react";
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

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const data = await login(email, password);

      localStorage.setItem(
        "titancrm_access_token",
        data.access_token,
      );

      alert("Inicio de sesión correcto");
    } catch {
      setErrorMessage("Correo o contraseña incorrectos.");
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
        padding: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent sx={{ padding: 4 }}>
          <Typography
           variant="h4"
           align="center"
           sx={{
           fontWeight: "bold",
           mb: 1,
           }}
          >
            🚀 TitanCRM
          </Typography>

          <Typography
           align="center"
           color="text.secondary"
           sx={{ mb: 4 }}
          > 
            Gestión Inteligente de Clientes
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="email"
              label="Correo electrónico"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              margin="normal"
            />

            <TextField
              fullWidth
              type="password"
              label="Contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              margin="normal"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, minHeight: 44 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
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