import client from "@/api/client";

import type { UserRole } from "../roles";

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const formData = new URLSearchParams();

  formData.append(
    "username",
    email.trim().toLowerCase(),
  );

  formData.append(
    "password",
    password,
  );

  const response =
    await client.post<LoginResponse>(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      },
    );

  return response.data;
}