// src/utils/exportXLSX.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// data: array of objects, filename: string (ending with .xlsx)
export function exportToXLSX(data, filename = "export.xlsx") {
  // If empty, don't export
  if (!data || !data.length) {
    alert("No data to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, filename);
}
