import client from "@/api/client";

export interface Customer {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

export interface CustomerCreate {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
}

export interface CustomerUpdate {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

function getAuthHeaders() {
  const token = localStorage.getItem(
    "titancrm_access_token",
  );

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await client.get<Customer[]>(
    "/customers",
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function createCustomer(
  customer: CustomerCreate,
): Promise<Customer> {
  const response = await client.post<Customer>(
    "/customers",
    customer,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function updateCustomer(
  customerId: number,
  customer: CustomerUpdate,
): Promise<Customer> {
  const response = await client.put<Customer>(
    `/customers/${customerId}`,
    customer,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function deleteCustomer(
  customerId: number,
): Promise<void> {
  await client.delete(
    `/customers/${customerId}`,
    {
      headers: getAuthHeaders(),
    },
  );
}