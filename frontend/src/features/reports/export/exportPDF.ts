import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PdfColumn<T> {
  header: string;
  value: (row: T) => string | number | boolean | null | undefined;
}

interface ExportPdfOptions<T> {
  title: string;
  fileName: string;
  rows: T[];
  columns: PdfColumn<T>[];
}

function sanitizeFileName(fileName: string) {
  const cleanName = fileName
    .trim()
    .replace(/[<>:"/\\|?*]/g, "-");

  return cleanName.toLowerCase().endsWith(".pdf")
    ? cleanName
    : `${cleanName}.pdf`;
}

export function exportToPDF<T>({
  title,
  fileName,
  rows,
  columns,
}: ExportPdfOptions<T>) {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  pdf.setFontSize(18);
  pdf.text(title, 14, 18);

  pdf.setFontSize(10);

  pdf.text(
    `Generado: ${new Date().toLocaleString("es-PE")}`,
    14,
    25,
  );

  autoTable(pdf, {
    startY: 32,

    head: [
      columns.map((column) => column.header),
    ],

    body: rows.map((row) =>
      columns.map((column) =>
        String(column.value(row) ?? ""),
      ),
    ),

    styles: {
      fontSize: 9,
      cellPadding: 2,
    },

    headStyles: {
      fillColor: [25, 118, 210],
      textColor: 255,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  pdf.save(sanitizeFileName(fileName));
}