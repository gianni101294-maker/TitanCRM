import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface TopCustomer {
  id: number;
  company: string;
  totalValue: number;
}

interface TopCustomersTableProps {
  customers: TopCustomer[];
}

function formatCurrency(value: number) {
  return value.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  });
}

export function TopCustomersTable({
  customers,
}: TopCustomersTableProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Top 5 Clientes
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                Empresa
              </TableCell>

              <TableCell align="right">
                Valor
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  {customer.company}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(
                    customer.totalValue,
                  )}
                </TableCell>
              </TableRow>
            ))}

            {customers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  align="center"
                >
                  No hay datos disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}