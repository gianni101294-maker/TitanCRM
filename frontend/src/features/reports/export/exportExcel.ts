import * as XLSX from "xlsx";

export interface ExcelSheet {
  name: string;
  rows: Record<string, string | number | boolean | null>[];
}

interface ExportExcelOptions {
  fileName: string;
  sheets: ExcelSheet[];
}

function sanitizeSheetName(name: string) {
  return name
    .replace(/[\\/?*[\]:]/g, " ")
    .trim()
    .slice(0, 31);
}

function sanitizeFileName(fileName: string) {
  const cleanName = fileName
    .trim()
    .replace(/[<>:"/\\|?*]/g, "-");

  return cleanName.toLowerCase().endsWith(".xlsx")
    ? cleanName
    : `${cleanName}.xlsx`;
}

export function exportToExcel({
  fileName,
  sheets,
}: ExportExcelOptions) {
  if (sheets.length === 0) {
    throw new Error(
      "Debe existir al menos una hoja para exportar.",
    );
  }

  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet, index) => {
    const sheetName =
      sanitizeSheetName(sheet.name) ||
      `Hoja ${index + 1}`;

    const worksheet =
      sheet.rows.length > 0
        ? XLSX.utils.json_to_sheet(sheet.rows)
        : XLSX.utils.aoa_to_sheet([
            ["Sin datos disponibles"],
          ]);

    if (sheet.rows.length > 0) {
      const headers = Object.keys(sheet.rows[0]);

      worksheet["!cols"] = headers.map((header) => {
        const longestValue = sheet.rows.reduce(
          (currentLength, row) => {
            const cellValue = String(
              row[header] ?? "",
            );

            return Math.max(
              currentLength,
              cellValue.length,
            );
          },
          header.length,
        );

        return {
          wch: Math.min(
            Math.max(longestValue + 2, 12),
            40,
          ),
        };
      });
    }

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      sheetName,
    );
  });

  XLSX.writeFile(
    workbook,
    sanitizeFileName(fileName),
    {
      compression: true,
    },
  );
}