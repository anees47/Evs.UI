// export.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import { TableColumnInterface } from '../Modals/TableModals';
import { ExportFile, FileExportEnum, FileExportPath } from '../interfaces/TableInterfaces';



@Injectable({
  providedIn: 'root',
})
export class FileExportService {
  private exportFilesSubject: BehaviorSubject<ExportFile[]> = new BehaviorSubject<ExportFile[]>([]);
  exportFiles$: Observable<ExportFile[]> = this.exportFilesSubject.asObservable();
  private exportFileSubject: BehaviorSubject<ExportFile> = new BehaviorSubject<ExportFile>(undefined as any);
  exportFile$: Observable<ExportFile> = this.exportFileSubject.asObservable();
  constructor() {}

  private addExportFile(name:string, loading:boolean, imageUrl:FileExportPath) {
    const file: ExportFile = {
      name: name,
      loading: loading,
      imageUrl: imageUrl
    }
    const currentFiles = this.exportFilesSubject.value;
    this.exportFileSubject.next(file);
    this.exportFilesSubject.next([...currentFiles, file]);
  }

  private updateExportFile(loading: boolean) {
    const currentFile = this.exportFileSubject.value;
    if (!currentFile) return;
    const updatedFile = { ...currentFile, loading };
    const currentFiles = this.exportFilesSubject.value.map((file) =>
      file.name === currentFile.name ? updatedFile : file
    );
    this.exportFilesSubject.next([...currentFiles]);
    this.exportFileSubject.next(updatedFile);
  }
  onDataExport(key: FileExportEnum, gridName: string, gridFilteredData: any[], selectedColumns: TableColumnInterface[]) {
    if (key === FileExportEnum.CSV) {
      this.exportCSV(gridName, gridFilteredData, selectedColumns)
    }
    else if (key === FileExportEnum.PDF) {
      this.exportPdf(gridName, selectedColumns, gridFilteredData);
    }
    else if (key === FileExportEnum.EXCEL) {
      this.exportExcel(gridName, gridFilteredData, selectedColumns);
    }
  }

  close() {
    this.exportFileSubject.next(undefined as any);
    this.exportFilesSubject.next([])
  }


  private exportCSV(gridId: string, gridData: any[], selectedColumns: TableColumnInterface[]) {

    this.addExportFile(gridId,true,FileExportPath.CSV); // Assuming FileExportPath.EXCEL is a generic "exporting file" status, or you might have a FileExportPath.CSV

  import('xlsx').then((xlsx) => {
    // 1. Filter selectedColumns to include only visible columns and exclude 'Action' and 'Actions'
    const exportColumns = selectedColumns.filter(col =>
      col.isVisible && col.name.toLowerCase() !== 'action' && col.name.toLowerCase() !== 'actions'
    );

    // 2. Create a header array for the CSV using the filtered columns' nameText
    const headers = exportColumns.map(col => col.nameText);

    // 3. Prepare the data by mapping each row to include only the values for the exportColumns.
    // This step is crucial for CSV to ensure only the desired columns are present.
    const formattedData = gridData.map(row => {
      const newRow: { [key: string]: any } = {};
      exportColumns.forEach(col => {
        // Use col.name as the key to get the value from the original row
        // Ensure values are handled for CSV (e.g., wrap strings with commas in quotes)
        let value = row[col.name];
        if (typeof value === 'string' && value.includes(',')) {
          value = `"${value}"`; // Simple CSV escaping for commas
        }
        newRow[col.name] = value;
      });
      return newRow;
    });

    // 4. Create the worksheet with the filtered data and custom headers.
    // For CSV, we'll use the headers array directly for the first row.
    const worksheet = xlsx.utils.json_to_sheet(formattedData, { header: exportColumns.map(col => col.name) });

    // Manually add headers to the first row (A1, B1, C1, etc.)
    // This ensures the correct display names are used as headers in the CSV.
    xlsx.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    // 5. Convert the worksheet to CSV string
    // Change bookType to 'csv' and type to 'string'
    const csvString: string = xlsx.utils.sheet_to_csv(worksheet); // Use sheet_to_csv for direct CSV output

    const File_TYPE = 'text/csv;charset=utf-8;';
    const File_EXTENSION = '.csv';

    const data: Blob = new Blob([csvString], { // Use csvString directly here
      type: File_TYPE
    });

    FileSaver.saveAs(data, gridId + '_export_' + new Date().getTime() + File_EXTENSION);
    this.updateExportFile(false);
  });
}

  private exportPdf(gridId: string, columns: TableColumnInterface[], gridData: any) {
    this.addExportFile(gridId,true,FileExportPath.PDF);
    import('jspdf').then((jsPDF: any) => {
      import('jspdf-autotable').then(() => {
        const exportColumns = (columns || []).map((col: any) => ({
          title: col.nameText,
          dataKey: col.name,
          width: col.width || 'auto'
        }));
        const totalWidth = exportColumns.reduce((sum, col) => sum + (col.width !== 'auto' ? col.width : 100), 0);
        const pageWidth = Math.max(595.28, totalWidth);
        const doc = new jsPDF.default('l', 'pt', [pageWidth, 842]);
        (doc as any).autoTable({
          head: [exportColumns.map((col: any) => col.title)],
          body: gridData.map((row: any) => exportColumns.map(col => row[col.dataKey])),
          columnStyles: exportColumns.reduce((styles:any, col, index) => {
            styles[index] = { cellWidth: col.width };  // Set column width here
            return styles;
          }, {}),
          margin: { top: 20 },
          startY: 20,
          headStyles: {
            cellPadding: 2,
          },
        });
        doc.save(new Date().getTime() + '.pdf');
        this.updateExportFile(false);
      });
    });
  }

private exportExcel(gridId:string, gridData:any[], selectedColumns: TableColumnInterface[]) {
  this.addExportFile(gridId,true,FileExportPath.EXCEL);
  import('xlsx').then((xlsx) => {
    // 1. Filter selectedColumns to include only visible columns and exclude 'Action'
    const exportColumns = selectedColumns.filter(col =>
      col.isVisible && col.name.toLowerCase() !== 'action'&& col.name.toLowerCase() !== 'actions'
    );

    // 2. Create a header array for the Excel sheet using the filtered columns' nameText
    const headers = exportColumns.map(col => col.nameText);

    // 3. Prepare the data by mapping each row to include only the values for the exportColumns
    const formattedData = gridData.map(row => {
      const newRow: { [key: string]: any } = {};
      exportColumns.forEach(col => {
        newRow[col.name] = row[col.name]; // Use col.name as the key to get the value from the original row
      });
      return newRow;
    });

    // 4. Create the worksheet with the filtered data and custom headers
    // The { header: headers } option ensures that only these columns are included
    // and their corresponding nameText is used as the header.
    const worksheet = xlsx.utils.json_to_sheet(formattedData, { header: exportColumns.map(col => col.name) }); // Use col.name for json_to_sheet to correctly map data

    // Manually add headers to the first row (A1, B1, C1, etc.)
    xlsx.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([excelBuffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, gridId + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    this.updateExportFile(false);
  });
}
}

