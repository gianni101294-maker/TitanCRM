import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
  type Customer,
  type CustomerCreate,
  type CustomerUpdate,
} from "../api/customers";

const initialForm: CustomerCreate = {
  company_name: "",
  contact_name: "",
  email: "",
  phone: "",
};

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const [isDialogOpen, setIsDialogOpen] =
    useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] =
    useState<CustomerCreate>(initialForm);

  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [customerToDelete, setCustomerToDelete] =
    useState<Customer | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const reloadCustomers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const customerData = await getCustomers();
      setCustomers(customerData);
    } catch {
      setErrorMessage(
        "No se pudieron cargar los clientes.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialCustomers() {
      try {
        const customerData = await getCustomers();

        if (isMounted) {
          setCustomers(customerData);
          setErrorMessage("");
        }
      } catch {
        if (isMounted) {
          setErrorMessage(
            "No se pudieron cargar los clientes.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialCustomers();

    return () => {
      isMounted = false;
    };
  }, []);

  function openCreateDialog() {
    setEditingCustomer(null);
    setFormData(initialForm);
    setFormError("");
    setIsDialogOpen(true);
  }

  function openEditDialog(customer: Customer) {
    setEditingCustomer(customer);

    setFormData({
      company_name: customer.company_name,
      contact_name: customer.contact_name,
      email: customer.email,
      phone: customer.phone,
    });

    setFormError("");
    setIsDialogOpen(true);
  }

  function closeCustomerDialog() {
    if (!isSaving) {
      setIsDialogOpen(false);
      setEditingCustomer(null);
      setFormData(initialForm);
      setFormError("");
    }
  }

  function updateField(
    field: keyof CustomerCreate,
    value: string,
  ) {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function saveCustomer() {
    setFormError("");
    setIsSaving(true);

    try {
      if (editingCustomer) {
        const updateData: CustomerUpdate = {
          ...formData,
          is_active: editingCustomer.is_active,
        };

        const updatedCustomer = await updateCustomer(
          editingCustomer.id,
          updateData,
        );

        setCustomers((currentCustomers) =>
          currentCustomers.map((customer) =>
            customer.id === updatedCustomer.id
              ? updatedCustomer
              : customer,
          ),
        );

        setSuccessMessage(
          "Cliente actualizado correctamente.",
        );
      } else {
        const newCustomer = await createCustomer(
          formData,
        );

        setCustomers((currentCustomers) => [
          ...currentCustomers,
          newCustomer,
        ]);

        setSuccessMessage(
          "Cliente creado correctamente.",
        );
      }

      setIsDialogOpen(false);
      setEditingCustomer(null);
      setFormData(initialForm);

      return true;
    } catch {
      setFormError(
        "No se pudo guardar el cliente. Revisa los datos ingresados.",
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function removeCustomer() {
    if (!customerToDelete) {
      return false;
    }

    setIsDeleting(true);

    try {
      await deleteCustomer(customerToDelete.id);

      setCustomers((currentCustomers) =>
        currentCustomers.filter(
          (customer) =>
            customer.id !== customerToDelete.id,
        ),
      );

      setSuccessMessage(
        "Cliente eliminado correctamente.",
      );

      setCustomerToDelete(null);

      return true;
    } catch {
      setErrorMessage(
        "No se pudo eliminar el cliente. Inténtalo nuevamente.",
      );

      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  const filteredCustomers = useMemo(() => {
    const searchValue = searchTerm
      .toLowerCase()
      .trim();

    return customers.filter(
      (customer) =>
        customer.company_name
          .toLowerCase()
          .includes(searchValue) ||
        customer.contact_name
          .toLowerCase()
          .includes(searchValue) ||
        customer.email
          .toLowerCase()
          .includes(searchValue),
    );
  }, [customers, searchTerm]);

  return {
    customers,
    filteredCustomers,
    searchTerm,
    setSearchTerm,

    isLoading,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,

    isDialogOpen,
    isSaving,
    formData,
    formError,
    editingCustomer,

    customerToDelete,
    setCustomerToDelete,
    isDeleting,

    openCreateDialog,
    openEditDialog,
    closeCustomerDialog,
    updateField,
    saveCustomer,
    removeCustomer,
    reloadCustomers,
  };
}