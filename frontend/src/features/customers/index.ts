export {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "./api/customers";

export type {
  Customer,
  CustomerCreate,
  CustomerUpdate,
} from "./api/customers";

export {
  CustomerDeleteDialog,
} from "./components/CustomerDeleteDialog";

export {
  CustomerFormDialog,
} from "./components/CustomerFormDialog";

export {
  CustomerTable,
} from "./components/CustomerTable";

export {
  useCustomers,
} from "./hooks/useCustomers";

export {
  CustomersPage,
} from "./pages/CustomersPage";
