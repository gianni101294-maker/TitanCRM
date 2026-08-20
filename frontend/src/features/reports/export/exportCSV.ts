type CsvValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export interface CsvColumn<T> {
  header: string;
  value: (row: T) => CsvValue;
}

interface ExportCsvOptions<T> {
  fileName: string;
  rows: T[];
  columns: CsvColumn<T>[];
}

function sanitizeFileName(fileName: string) {
  const cleanName = fileName
    .trim()
    .replace(/[<>:"/\\|?*]/g, "-");

  return cleanName.toLowerCase().endsWith(".csv")
    ? cleanName
    : `${cleanName}.csv`;
}

function escapeCsvValue(value: CsvValue) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r")
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function exportToCSV<T>({
  fileName,
  rows,
  columns,
}: ExportCsvOptions<T>) {
  if (columns.length === 0) {
    throw new Error(
      "Debe existir al menos una columna para exportar.",
    );
  }

  const headerRow = columns
    .map((column) =>
      escapeCsvValue(column.header),
    )
    .join(",");

  const dataRows = rows.map((row) =>
    columns
      .map((column) =>
        escapeCsvValue(column.value(row)),
      )
      .join(","),
  );

  const csvContent = [
    headerRow,
    ...dataRows,
  ].join("\r\n");

  const blob = new Blob(
    [`\uFEFF${csvContent}`],
    {
      type: "text/csv;charset=utf-8;",
    },
  );

  const downloadUrl =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = downloadUrl;
  link.download =
    sanitizeFileName(fileName);

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(downloadUrl);
}