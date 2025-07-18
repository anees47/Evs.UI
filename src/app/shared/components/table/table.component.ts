import { Component, Input, Output, EventEmitter, signal, effect, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableInterface, TableColumnInterface, TableColumnFilterEnum, TableColumnFilterStateEnum } from '../../Modals/TableModals';

@Component({
  selector: 'e2v-table',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  @Input({required:true}) configs!: Partial<TableInterface>;

  @Output() itemSelected = new EventEmitter<any[]>();
  @Output() onExport = new EventEmitter<any>();
  @Output() actionClicked = new EventEmitter<{ action: string; rowData: any }>();
  @Output() sortClicked = new EventEmitter<{ field: string; direction: string }>();
  @Output() cellActionClicked = new EventEmitter<{ field: string; rowData: any }>();

  // Signals
  toggleFilter = signal(false);
  selectedListItems: any[] = [];
  filterText = signal('');
  filteredData = signal<any[]>([]);
  isLoading = signal(true);
  columnFilters = signal<{ [key: string]: string }>({});
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Column management
  selectedColumns: TableColumnInterface[] = [];
  gridColumns: TableColumnInterface[] = [];
  globalFilterFields: string[] = [];

  // Table view sizes
  readonly tableViewSizes = [
    {name: 'Small', class: 'table-sm', icon: 'bi bi-grid-3x3'},
    {name: 'Medium', class: '', icon: 'bi bi-grid'},
    {name: 'Large', class: 'table-lg', icon: 'bi bi-grid-1x2'}
  ];
  selectedSize = '';

  // Filter types
  filterTypes = TableColumnFilterEnum;

  // Custom filters
  customFilterList: any[] = [];
  myFilteredView = signal<any[]>([]);

  constructor(private cdr: ChangeDetectorRef) {
    // Set up reactive effects for filtering
    effect(() => {
      if(!this.configs.hasBatchCall) {
        this.toggleFilter.set(this.configs.defaultFilterState === TableColumnFilterStateEnum.OPEN);
      }
      this.loadData(this.configs.data ?? []);
      this.selectAll(this.configs.isCustomSelectionOn);
    });

    // Reactive effect for search and filtering - watch filterText and columnFilters signals
    effect(() => {
      // Access the signals to make the effect reactive to their changes
      const currentFilterText = this.filterText();
      const currentColumnFilters = this.columnFilters();
      const currentMyFilteredView = this.myFilteredView();
      
      this.applyFilter();
    });
  }

  ngOnInit() {
    if (this.configs) {
      this.loadData(this.configs.data ?? []);
      this.initializeColumnFilters();
    }
  }

  ngOnDestroy() {
    // Clean up if needed
  }

  loadData(data: any[]) {
    this.gridColumns = this.configs.columns || [];
    this.selectedColumns = (this.gridColumns || []).filter(x => x.isVisible !== false);
    this.globalFilterFields = (this.gridColumns || []).map((x) => x.field || x.name);
    this.filteredData.set(data || []);
    this.isLoading.set(false);
  }

  initializeColumnFilters() {
    const filters: { [key: string]: string } = {};
    (this.configs.columns || []).forEach((col: any) => {
      filters[col.field || col.name] = '';
    });
    this.columnFilters.set(filters);
  }

  applyFilter() {
    if (!this.configs.data) return;
    
    const globalFilter = this.filterText().toLowerCase();
    const currentColumnFilters = this.columnFilters();
    
    let filtered = this.configs.data.filter((row: any) => {
      // Global filter - only search in visible column fields
      const matchesGlobal = !globalFilter || 
        this.selectedColumns.some(col => {
          const fieldValue = row[col.field || col.name];
          return String(fieldValue || '').toLowerCase().includes(globalFilter);
        });
      
      // Per-column filters
      const matchesColumns = Object.entries(currentColumnFilters).every(([field, value]) => {
        if (!value) return true;
        const col = (this.configs.columns || []).find(c => (c.field || c.name) === field);
        if (col?.filterType === TableColumnFilterEnum.DROPDOWN) {
          return row[field] == value;
        }
        return String(row[field] ?? '').toLowerCase().includes(value.toLowerCase());
      });
      
      return matchesGlobal && matchesColumns;
    });

    // Apply custom filters
    if (this.myFilteredView().length > 0) {
      filtered = filtered.filter((data: any) =>
        this.evaluateCustomFilters(data, this.myFilteredView().map((a: any) => a.conditions))
      );
    }

    // Apply sorting
    if (this.sortField) {
      filtered = this.sortData(filtered, this.sortField, this.sortDirection);
    }

    this.filteredData.set(filtered);
    // Maintain filter state to prevent auto-closing
    this.maintainFilterState();
    // Only trigger change detection if necessary to prevent filter row from closing
    // this.cdr.detectChanges();
  }

  sortData(data: any[], field: string, direction: 'asc' | 'desc'): any[] {
    return [...data].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      // Handle null/undefined values
      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

      // Convert to string for comparison
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (direction === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }

  evaluateCustomFilters(data: any, conditions: any[]): boolean {
    // Simple custom filter evaluation - can be enhanced based on needs
    return conditions.every((condition: any) => {
      const value = data[condition.columnName];
      const filterValue = condition.filterValue;

      switch (condition.filterOperator) {
        case 'equals':
          return value == filterValue;
        case 'contains':
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'startsWith':
          return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
        case 'endsWith':
          return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
        default:
          return true;
      }
    });
  }

  onColumnFilterChange(field: string, value: string) {
    const currentFilters = this.columnFilters();
    currentFilters[field] = value;
    this.columnFilters.set({...currentFilters});
    
    // Maintain filter state to prevent auto-closing
    this.maintainFilterState();
  }

  onSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    // Apply sorting immediately
    this.applyFilter();
    
    // Emit sort event
    this.sortClicked.emit({ field, direction: this.sortDirection });
  }

  onCellActionClick(field: string, rowData: any) {
    this.cellActionClicked.emit({ field, rowData });
  }

  selectAll(event: any) {
    this.selectedListItems = [];
    const isChecked = typeof event === 'boolean' ? event : event?.target?.checked;

    if (isChecked) {
      this.filteredData().forEach(item => {
        item.selected = true;
        this.selectedListItems.push(item);
      });
    } else {
      this.filteredData().forEach(item => (item.selected = false));
    }
    this.emitSelectedItems();
  }

  checkBoxValueChange(event: any, selectedItem: any) {
    const isChecked = typeof event === 'boolean' ? event : event?.target?.checked;

    if (isChecked) {
      this.selectedListItems.push(selectedItem);
    } else {
      const index = this.selectedListItems.indexOf(selectedItem);
      if (index !== -1) {
        this.selectedListItems.splice(index, 1);
      }
    }
    this.emitSelectedItems();
  }

  emitSelectedItems() {
    this.itemSelected.emit(this.selectedListItems);
  }

  onActionClick(action: string, rowData: any) {
    // Emit action event for parent component to handle
    this.actionClicked.emit({ action, rowData });
  }

  onExportClick() {
    const data = this.filteredData();
    const exportData = {
      data: data,
      columns: this.selectedColumns,
      fileName: `${this.configs.gridName || 'table-data'}-${new Date().toISOString().split('T')[0]}`
    };
    this.onExport.emit(exportData);
    
    // Also implement basic CSV export
    this.exportToCSV(data, exportData.fileName);
  }

  exportToCSV(data: any[], fileName: string) {
    if (!data || data.length === 0) return;

    // Get headers from selected columns
    const headers = this.selectedColumns.map(col => col.nameText);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(row => {
      const rowData = this.selectedColumns.map(col => {
        const value = row[col.field || col.name];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csvContent += rowData.join(',') + '\n';
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Column management
  onColumnsShowHideToggle(columns: TableColumnInterface[]) {
    this.selectedColumns = columns.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  onColumnVisibilityChange(event: Event, column: TableColumnInterface) {
    const target = event.target as HTMLInputElement;
    if (target) {
      column.isVisible = target.checked;
      this.selectedColumns = this.gridColumns.filter(col => col.isVisible !== false);
      this.cdr.detectChanges();
    }
  }

  // Custom filter management
  filterSelected(filter: any) {
    const isFilterAlreadyApplied = this.myFilteredView().some(
      (a) => a.viewId === filter.viewId
    );
    if (isFilterAlreadyApplied) {
      // Show info message - you can implement a toast service
      console.log(`Filter "${filter.viewName}" is already applied.`);
    } else {
      this.myFilteredView.update((myFilter) => [...myFilter, filter]);
      this.applyFilter();
    }
  }

  filterRemoved(filter: any) {
    this.myFilteredView.update((myView) => myView.filter(
      (a) => a.viewId !== filter.viewId
    ));
    this.applyFilter();
  }

  removeFilter(index: number) {
    const newList = this.myFilteredView();
    newList.splice(index, 1);
    this.myFilteredView.set([...newList]);
    this.applyFilter();
  }

  removeAllFilter() {
    this.myFilteredView.set([]);
    this.applyFilter();
  }

  // Table view size
  onTableViewSizeChange(size: string) {
    this.selectedSize = size;
  }

  // Row double click
  onRowDoubleClick(event: MouseEvent) {
    // Handle row double click if needed
  }

  // Custom filter for dropdown columns
  customFilter(value: string | number, column: TableColumnInterface, filterCallback: Function) {
    filterCallback(value);
  }

  // Column checkbox change
  colCheckBoxValueChange(event: any, action: any, colName: string, callBack: any) {
    if (callBack) {
      callBack(event, action, colName);
    }
  }

  // Get column filter value safely
  getColumnFilter(field: string): string {
    return this.columnFilters()[field] || '';
  }

  // Get sort icon class
  getSortIconClass(field: string): string {
    if (this.sortField !== field) {
      return 'bi bi-arrow-down-up';
    }
    return this.sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }

  // Toggle filter visibility
  toggleFilterVisibility() {
    this.toggleFilter.update(current => !current);
  }

  // Handle filter input focus to ensure filter row stays open
  onFilterInputFocus() {
    if (this.toggleFilter() === false) {
      this.toggleFilter.set(true);
    }
  }

  // Handle filter input events to prevent auto-closing
  onFilterInput(event: Event) {
    // Prevent the filter row from closing during input
    event.stopPropagation();
  }

  // Handle global filter changes
  onGlobalFilterChange(value: string) {
    this.filterText.set(value);
    // Explicitly trigger filter application
    this.applyFilter();
  }

  // Ensure filter state is maintained during operations
  private maintainFilterState() {
    // If filters are enabled and we have column filters, keep the filter row open
    if (this.configs.enableColumnFilter && Object.values(this.columnFilters()).some(value => value !== '')) {
      if (this.toggleFilter() === false) {
        this.toggleFilter.set(true);
      }
    }
  }

  // Get filtered data count
  getFilteredDataCount(): number {
    return this.filteredData().length;
  }

  // Get total data count
  getTotalDataCount(): number {
    return this.configs.data?.length || 0;
  }
}
