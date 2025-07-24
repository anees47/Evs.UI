export interface ITableAction {
    name: string;
    icon: string;
    key: string;
    isIcon: boolean;
    callback:any

}

export interface ExportFile {
  name: string;
  loading: boolean;
  imageUrl: string;
}

export interface ExportFileOptions {
  name: string;
  icon: string;
  key: string;
  isIcon: boolean;
}

export enum FileExportEnum {
    PDF = 'pdf',
    CSV = 'csv',
    EXCEL = 'xlsx',
  }

  export enum FileExportPath {
    PDF = 'assets/images/pdf-file-type-svgrepo-com.svg',
    CSV = 'assets/images/csv-svgrepo-com.svg',
    EXCEL = 'assets/images/excel-file-type-svgrepo-com.svg',
  }

  