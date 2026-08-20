import client from "@/api/client";

import type { UserRole } from "@/features/auth/roles";


export interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


export interface UserCreate {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  is_active: boolean;
}


export interface UserUpdate {
  full_name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  is_active?: boolean;
}


export interface AuthenticatedUser {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}


export async function getUsers(): Promise<User[]> {
  const response =
    await client.get<User[]>(
      "/users",
    );

  return response.data;
}


export async function createUser(
  payload: UserCreate,
): Promise<User> {
  const response =
    await client.post<User>(
      "/users",
      payload,
    );

  return response.data;
}


export async function updateUser(
  userId: number,
  payload: UserUpdate,
): Promise<User> {
  const response =
    await client.put<User>(
      `/users/${userId}`,
      payload,
    );

  return response.data;
}


export async function deleteUser(
  userId: number,
): Promise<void> {
  await client.delete(
    `/users/${userId}`,
  );
}
