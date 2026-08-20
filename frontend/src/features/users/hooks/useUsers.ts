import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  type User,
  type UserCreate,
} from "../api/users";
import { USER_ROLES } from "@/features/auth/roles";

const initialFormData: UserCreate = {
  full_name: "",
  email: "",
  password: "",
  role: USER_ROLES.SALES,
  is_active: true,
};

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);
  const [isSaving, setIsSaving] =
    useState(false);
  const [isDeleting, setIsDeleting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");
  const [formError, setFormError] =
    useState("");

  const [isDialogOpen, setIsDialogOpen] =
    useState(false);
  const [editingUser, setEditingUser] =
    useState<User | null>(null);
  const [userToDelete, setUserToDelete] =
    useState<User | null>(null);

  const [formData, setFormData] =
    useState<UserCreate>(initialFormData);

  const reloadUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const userData = await getUsers();
      setUsers(userData);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "No se pudieron cargar los usuarios.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialUsers() {
      try {
        const userData = await getUsers();

        if (isMounted) {
          setUsers(userData);
          setErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            getErrorMessage(
              error,
              "No se pudieron cargar los usuarios.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) =>
      [
        user.full_name,
        user.email,
        user.role,
        user.is_active ? "activo" : "inactivo",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [searchTerm, users]);

  function openCreateDialog() {
    setEditingUser(null);
    setFormData(initialFormData);
    setFormError("");
    setIsDialogOpen(true);
  }

  function openEditDialog(user: User) {
    setEditingUser(user);

    setFormData({
      full_name: user.full_name,
      email: user.email,
      password: "",
      role: user.role,
      is_active: user.is_active,
    });

    setFormError("");
    setIsDialogOpen(true);
  }

  function closeUserDialog() {
    if (isSaving) {
      return;
    }

    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData(initialFormData);
    setFormError("");
  }

  function updateField<K extends keyof UserCreate>(
    field: K,
    value: UserCreate[K],
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function validateForm() {
    if (!formData.full_name.trim()) {
      return "El nombre completo es obligatorio.";
    }

    if (!formData.email.trim()) {
      return "El correo electrónico es obligatorio.";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      return "Ingresa un correo electrónico válido.";
    }

    if (
      !editingUser &&
      formData.password.trim().length < 6
    ) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    return "";
  }

  async function saveUser() {
    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSaving(true);
    setFormError("");
    setErrorMessage("");

    try {
      if (editingUser) {
        const updatedUser = await updateUser(
          editingUser.id,
          {
            full_name: formData.full_name,
            email: formData.email,
            role: formData.role,
            is_active: formData.is_active,
          },
        );

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === updatedUser.id
              ? updatedUser
              : user,
          ),
        );

        setSuccessMessage(
          "Usuario actualizado correctamente.",
        );
      } else {
        const newUser = await createUser(
          formData,
        );

        setUsers((currentUsers) => [
          newUser,
          ...currentUsers,
        ]);

        setSuccessMessage(
          "Usuario creado correctamente.",
        );
      }

      setIsDialogOpen(false);
      setEditingUser(null);
      setFormData(initialFormData);
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          "No se pudo guardar el usuario.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function removeUser() {
    if (!userToDelete) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await deleteUser(userToDelete.id);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) =>
            user.id !== userToDelete.id,
        ),
      );

      setUserToDelete(null);

      setSuccessMessage(
        "Usuario eliminado correctamente.",
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "No se pudo eliminar el usuario.",
        ),
      );

      setUserToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    users,
    filteredUsers,

    searchTerm,
    setSearchTerm,

    isLoading,
    isSaving,
    isDeleting,

    errorMessage,
    setErrorMessage,

    successMessage,
    setSuccessMessage,

    formError,
    formData,

    isDialogOpen,
    editingUser,

    userToDelete,
    setUserToDelete,

    openCreateDialog,
    openEditDialog,
    closeUserDialog,

    updateField,
    saveUser,
    removeUser,
    reloadUsers,
  };
}