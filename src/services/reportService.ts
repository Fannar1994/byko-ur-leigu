
import ExcelJS from 'exceljs';
import { RentalItem } from '@/types/contract';

/**
 * Generate an HTML table with the rental items data
 */
export function generateHtmlReport(items: RentalItem[], contractId: string, operation: 'tiltekt' | 'offhire'): string {
  const title = operation === 'tiltekt' ? 'Tiltekt Skýrsla' : 'Úr Leigu Skýrsla';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .report-header { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="report-header">
        <h2>${title}</h2>
        <p>Samningur: ${contractId}</p>
        <p>Dagsetning: ${new Date().toLocaleDateString('is-IS')}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Leigunúmer</th>
            <th>Vöruheiti</th>
            <th>Deild</th>
            <th>Staða</th>
            <th>Talningar</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.serialNumber}</td>
              <td>${item.itemName}</td>
              <td>${item.department || '-'}</td>
              <td>${item.status || '-'}</td>
              <td>1</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  return html;
}

/**
 * Generate an Excel file with the rental items data
 */
export async function generateExcelReport(items: RentalItem[], contractId: string, operation: 'tiltekt' | 'offhire'): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const title = operation === 'tiltekt' ? 'Tiltekt Skýrsla' : 'Úr Leigu Skýrsla';
  
  workbook.creator = 'BYKO Tiltektarkerfi';
  workbook.created = new Date();
  
  const worksheet = workbook.addWorksheet(title);
  
  // Add header row
  worksheet.addRow(['Samningur:', contractId]);
  worksheet.addRow(['Dagsetning:', new Date().toLocaleDateString('is-IS')]);
  worksheet.addRow([]);
  
  // Add column headers
  worksheet.addRow(['Leigunúmer', 'Vöruheiti', 'Deild', 'Staða', 'Talningar']);
  
  // Style header row
  const headerRow = worksheet.getRow(4);
  headerRow.font = { bold: true };
  headerRow.eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  
  // Add data rows
  items.forEach(item => {
    worksheet.addRow([
      item.serialNumber,
      item.itemName,
      item.department || '-',
      item.status || '-',
      1 // Default count
    ]);
  });
  
  // Format all cells
  worksheet.columns.forEach(column => {
    column.width = 20;
  });
  
  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}

/**
 * Prepare report data for both formats
 */
export async function prepareReportData(items: RentalItem[], contractId: string, operation: 'tiltekt' | 'offhire', itemCounts?: Record<string, number>): Promise<{
  htmlReport: string;
  excelBuffer: Buffer;
  fileName: string;
}> {
  // Apply item counts if available
  const itemsWithCounts = items.map(item => {
    if (itemCounts && itemCounts[item.id]) {
      return { ...item };
    }
    return item;
  });
  
  const htmlReport = generateHtmlReport(itemsWithCounts, contractId, operation);
  const excelBuffer = await generateExcelReport(itemsWithCounts, contractId, operation);
  
  const operationName = operation === 'tiltekt' ? 'Tiltekt' : 'UrLeigu';
  const fileName = `BYKO_${operationName}_${contractId}_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  return {
    htmlReport,
    excelBuffer,
    fileName
  };
}
