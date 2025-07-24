
export enum TableColumnFilterMatchModeEnum {
  IN = 'in',
  EQUALS = 'equals',
  BETWEEN = 'between'
}

export enum TableColumnFilterStateEnum {
  OPEN = 'open',
  CLOSE = 'close'
}

export interface TableInterface {
  dataKey: string;
  data: any[];
  columns: TableColumnInterface[];
  noDataText: string;
  enableColumnResize: boolean;
  enableTableViewSize: boolean;
  enableSorting: boolean;
  sortMode: TableSortModeEnum;
  enableGlobalSearch: boolean;
  enableColumnFilter: boolean;
  enableCustomFilter: boolean;
  enableColumnReorder: boolean;
  defaultFilterState: TableColumnFilterStateEnum;
  enableColumnToggle: boolean;
  enableExport: boolean;
  customExport: boolean;
  loaderRows: number;
  fixedHeaders: boolean;
  fixedHeadersHeight: string;
  countEndpointURI: string
  listEndpointURI: string
  gridId: string
  gridName: string
  loadPageSize: number
  rowHover: boolean
  exportOptions: ExportFileOptions[]
  isBatchCallInProgress: boolean;
  hasBatchCall: boolean;

  // When grid check  box is enabled for all selection and  select is happens dynamically by through code
  isCustomSelectionOn:boolean;
}

export interface TableColumnInterface {
  name: string;
  nameText: string;
  sortable?: boolean;
  field?: string;
  filter?: boolean;
  filterType?: TableColumnFilterEnum;
  filterValues?: any[];
  showMenu: boolean;
  filterMatchMode?: TableColumnFilterMatchModeEnum;
  placeholder?: string;
  pipes?: TablePipesInterface[];
  order?: number;
  classMapping?: any;
  cssClasses?: string;
  width?: number,
  isVisible?: boolean;
  columnFilterDDInstruction?: ColumnDefinations;
  callBack?: any,
  template?: any;
}

export interface ExportFileOptions {
  name: string;
  icon: string;
  key: string;
  isIcon: boolean;
}
export interface TablePipesInterface {
  name: any;
  args?: any[];
}
export interface ColumnDefinations {
  Field: string;
  valueMappings: { [key: string]: ValueMapping }
}
export interface ValueMapping {
  ValueName: string;
  MatchMode: string;
}
export enum TableColumnFilterEnum {
  TEXT = 'text',
  DROPDOWN = 'dropdown',
  MULTI_DROPDOWN = 'multi-dropdown',
  DATE = 'date',
  CHECK = 'checkbox',
  COLCHECK = 'col-check',
  SWITCH = 'switch',
  LINK = "LINK",
  CUSTOM_HTML_FIELD = "custom-html-field",
  IMAGE = "image",
  NONE = 'None'
}

export enum TableSortModeEnum {
  SINGLE = "single",
  MULTIPLE = "multiple",
}

