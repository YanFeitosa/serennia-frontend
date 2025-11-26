// src/lib/export.ts
// Utility functions for exporting data to PDF and Excel

/**
 * Export data to CSV (simpler alternative to Excel)
 */
export function exportToCSV(data: Record<string, any>[], filename: string, headers?: Record<string, string>) {
  if (data.length === 0) return;

  const keys = Object.keys(data[0]);
  const headerRow = keys.map(k => headers?.[k] || k).join(',');
  
  const rows = data.map(row => 
    keys.map(k => {
      const value = row[k];
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',')
  );

  const csv = [headerRow, ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export data to Excel using xlsx library (if available)
 * Falls back to CSV if xlsx is not available
 */
export async function exportToExcel(data: Record<string, any>[], filename: string, headers?: Record<string, string>) {
  try {
    // Try to dynamically import xlsx
    const XLSX = await import('xlsx');
    
    // Transform data with headers
    const transformedData = data.map(row => {
      const newRow: Record<string, any> = {};
      for (const [key, value] of Object.entries(row)) {
        const headerName = headers?.[key] || key;
        newRow[headerName] = value;
      }
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    
    // Generate buffer and download
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    downloadBlob(blob, `${filename}.xlsx`);
  } catch (error) {
    console.warn('xlsx not available, falling back to CSV', error);
    exportToCSV(data, filename, headers);
  }
}

/**
 * Export data to PDF using jspdf (if available)
 */
export async function exportToPDF(
  title: string,
  data: Record<string, any>[],
  columns: { key: string; header: string; width?: number }[],
  filename: string
) {
  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

    // Table
    const tableData = data.map(row => columns.map(col => {
      const value = row[col.key];
      if (typeof value === 'number') {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      }
      return value ?? '';
    }));

    autoTable(doc, {
      head: [columns.map(col => col.header)],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [37, 68, 90], // Primary color
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Erro ao gerar PDF. Verifique se as bibliotecas estão instaladas.');
  }
}

/**
 * Helper to download a blob
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format currency for export
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Format date for export
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

/**
 * Format datetime for export
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('pt-BR');
}

