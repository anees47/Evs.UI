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
      this.exportCSV(gridName, gridFilteredData)
    }
    else if (key === FileExportEnum.PDF) {
      this.exportPdf(gridName, selectedColumns, gridFilteredData);
    }
    else if (key === FileExportEnum.EXCEL) {
      this.exportExcel(gridName, gridFilteredData);
    }
  }

  close() {
    this.exportFileSubject.next(undefined as any);
    this.exportFilesSubject.next([])
  }

  private exportCSV(gridId: string, gridData: any[]) {
    this.addExportFile(gridId,true,FileExportPath.CSV);
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(gridData);
      const csv = xlsx.utils.sheet_to_csv(worksheet);
      const CSV_TYPE = 'text/csv;charset=utf-8;';
      const CSV_EXTENSION = '.csv';
      const data: Blob = new Blob([csv], {
        type: CSV_TYPE
      });
      FileSaver.saveAs(data, gridId + '_export_' + new Date().getTime() + CSV_EXTENSION);
      this.updateExportFile(false);
    })
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

 private exportExcel(gridId:string, gridData:any[]) {
    this.addExportFile(gridId,true,FileExportPath.EXCEL);
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(gridData);
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

