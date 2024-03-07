import type { Card } from "$lib/types";

export function downloadCSV(jsonData: Card[], filename: string) {
  const headers = Object.keys(jsonData[0]);
  const csvRows = [];
  csvRows.push(headers.join(","));
  jsonData.forEach((row) => {
    const values = headers.map((header) => {
      let value = row[header as keyof Card];
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      const escapedValue = String(value).replace(/"/g, '""');
      return `"${escapedValue}"`;
    });
    csvRows.push(values.join(","));
  });
  const blob = new Blob([csvRows.join('\n')], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}