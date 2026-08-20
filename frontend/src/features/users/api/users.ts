import type { UserRole } from "@/features/auth/roles";
import { USER_ROLES } from "@/features/auth/roles";

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface UserCreate {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  is_active: boolean;
}

export interface UserUpdate {
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

interface StoredUser extends User {
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

const USERS_STORAGE_KEY = "titancrm_users";

const initialUsers: StoredUser[] = [
  {
    id: 1,
    full_name: "Administrador TitanCRM",
    email: "admin@titancrm.com",
    password: "Admin123",
    role: USER_ROLES.ADMIN,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    full_name: "Supervisor Comercial",
    email: "supervisor@titancrm.com",
    password: "Supervisor123",
    role: USER_ROLES.SUPERVISOR,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    full_name: "Vendedor Demo",
    email: "vendedor@titancrm.com",
    password: "Vendedor123",
    role: USER_ROLES.SALES,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

function delay(milliseconds = 250) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isStoredUser(
  value: unknown,
): value is StoredUser {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const user = value as Partial<StoredUser>;

  return (
    typeof user.id === "number" &&
    typeof user.full_name === "string" &&
    typeof user.email === "string" &&
    typeof user.password === "string" &&
    typeof user.role === "string" &&
    typeof user.is_active === "boolean" &&
    typeof user.created_at === "string"
  );
}

function resetStoredUsers() {
  localStorage.setItem(
    USERS_STORAGE_KEY,
    JSON.stringify(initialUsers),
  );

  return [...initialUsers];
}

function readStoredUsers(): StoredUser[] {
  const storedValue = localStorage.getItem(
    USERS_STORAGE_KEY,
  );

  if (!storedValue) {
    return resetStoredUsers();
  }

  try {
    const parsedValue = JSON.parse(
      storedValue,
    ) as unknown;

    if (
      !Array.isArray(parsedValue) ||
      !parsedValue.every(isStoredUser)
    ) {
      return resetStoredUsers();
    }

    return parsedValue;
  } catch {
    return resetStoredUsers();
  }
}

function saveStoredUsers(
  users: StoredUser[],
) {
  localStorage.setItem(
    USERS_STORAGE_KEY,
    JSON.stringify(users),
  );
}

function removePassword(
  user: StoredUser,
): User {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    created_at: user.created_at,
  };
}

function validateUniqueEmail(
  users: StoredUser[],
  email: string,
  ignoredUserId?: number,
) {
  const normalizedEmail =
    normalizeEmail(email);

  const duplicatedUser = users.some(
    (user) =>
      user.id !== ignoredUserId &&
      normalizeEmail(user.email) ===
        normalizedEmail,
  );

  if (duplicatedUser) {
    throw new Error(
      "Ya existe un usuario registrado con ese correo.",
    );
  }
}

export async function getUsers(): Promise<
  User[]
> {
  await delay();

  return readStoredUsers()
    .map(removePassword)
    .sort(
      (first, second) =>
        second.id - first.id,
    );
}

export async function createUser(
  payload: UserCreate,
): Promise<User> {
  await delay();

  const users = readStoredUsers();

  validateUniqueEmail(
    users,
    payload.email,
  );

  const nextId =
    users.reduce(
      (highestId, user) =>
        Math.max(highestId, user.id),
      0,
    ) + 1;

  const newUser: StoredUser = {
    id: nextId,
    full_name: payload.full_name.trim(),
    email: normalizeEmail(payload.email),
    password: payload.password,
    role: payload.role,
    is_active: payload.is_active,
    created_at: new Date().toISOString(),
  };

  saveStoredUsers([
    ...users,
    newUser,
  ]);

  return removePassword(newUser);
}

export async function updateUser(
  userId: number,
  payload: UserUpdate,
): Promise<User> {
  await delay();

  const users = readStoredUsers();

  validateUniqueEmail(
    users,
    payload.email,
    userId,
  );

  const existingUser = users.find(
    (user) => user.id === userId,
  );

  if (!existingUser) {
    throw new Error(
      "No se encontró el usuario que deseas editar.",
    );
  }

  const updatedUser: StoredUser = {
    ...existingUser,
    full_name: payload.full_name.trim(),
    email: normalizeEmail(payload.email),
    role: payload.role,
    is_active: payload.is_active,
  };

  saveStoredUsers(
    users.map((user) =>
      user.id === userId
        ? updatedUser
        : user,
    ),
  );

  return removePassword(updatedUser);
}

export async function deleteUser(
  userId: number,
): Promise<void> {
  await delay();

  const users = readStoredUsers();

  const existingUser = users.find(
    (user) => user.id === userId,
  );

  if (!existingUser) {
    throw new Error(
      "No se encontró el usuario que deseas eliminar.",
    );
  }

  const activeAdministrators =
    users.filter(
      (user) =>
        user.role ===
          USER_ROLES.ADMIN &&
        user.is_active,
    );

  if (
    existingUser.role ===
      USER_ROLES.ADMIN &&
    existingUser.is_active &&
    activeAdministrators.length <= 1
  ) {
    throw new Error(
      "No puedes eliminar al único administrador activo.",
    );
  }

  saveStoredUsers(
    users.filter(
      (user) => user.id !== userId,
    ),
  );
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthenticatedUser> {
  await delay(350);

  const normalizedEmail =
    normalizeEmail(email);

  const user = readStoredUsers().find(
    (storedUser) =>
      normalizeEmail(
        storedUser.email,
      ) === normalizedEmail,
  );

  if (
    !user ||
    user.password !== password
  ) {
    throw new Error(
      "Correo o contraseña incorrectos.",
    );
  }

  if (!user.is_active) {
    throw new Error(
      "Tu cuenta se encuentra inactiva.",
    );
  }

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  };
}