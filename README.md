# E2V App - Enhanced Table Component

This project features a powerful, feature-rich table component built with Angular 19, Bootstrap 5, and custom CSS. The table component provides advanced functionality similar to PrimeNG's DataTable but without the PrimeNG dependency.

## Features

### Core Features
- ✅ **Global Search** - Search across all columns
- ✅ **Column Filtering** - Individual column filters with multiple filter types
- ✅ **Sorting** - Single and multiple column sorting
- ✅ **Column Management** - Show/hide columns dynamically
- ✅ **Export Options** - Export to Excel, CSV, PDF
- ✅ **Table View Sizes** - Small, Medium, Large table sizes
- ✅ **Row Selection** - Single and multiple row selection
- ✅ **Custom Filters** - Advanced filtering with custom conditions
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Loading States** - Built-in loading indicators
- ✅ **Empty States** - Customizable empty state messages

### Filter Types
- **Text Filter** - Simple text search
- **Dropdown Filter** - Predefined options
- **Date Filter** - Date range selection
- **Checkbox Filter** - Boolean values
- **Switch Filter** - Toggle values
- **Link Filter** - URL links
- **Custom HTML Filter** - Rich content
- **Image Filter** - Image thumbnails

### Column Types
- **Text** - Regular text display
- **Status** - Status badges with colors
- **Action Buttons** - Interactive buttons
- **Icons** - Icon-only buttons
- **Links** - Clickable links
- **Images** - Image thumbnails
- **Custom Templates** - Custom HTML content

## Installation

The table component is already included in this project. Make sure you have the following dependencies:

```json
{
  "bootstrap": "^5.3.7",
  "@angular/core": "^19.2.0",
  "@angular/forms": "^19.2.0",
  "@angular/common": "^19.2.0"
}
```

## Usage

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { TableComponent } from './shared/components/table/table.component';
import { TableInterface, TableColumnInterface, TableColumnFilterEnum } from './shared/Modals/TableModals';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TableComponent],
  template: `
    <e2v-table
      [configs]="tableConfig"
      (itemSelected)="onItemSelected($event)"
      (onExport)="onExport($event)"
      (actionClicked)="onActionClick($event)"
    ></e2v-table>
  `
})
export class ExampleComponent {
  columns: TableColumnInterface[] = [
    {
      name: 'id',
      nameText: 'ID',
      field: 'id',
      filter: true,
      filterType: TableColumnFilterEnum.TEXT,
      sortable: true,
      width: 80,
      isVisible: true,
      showMenu: false
    },
    {
      name: 'name',
      nameText: 'Name',
      field: 'name',
      filter: true,
      filterType: TableColumnFilterEnum.TEXT,
      sortable: true,
      width: 150,
      isVisible: true,
      showMenu: false
    }
  ];

  data = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ];

  tableConfig: TableInterface = {
    dataKey: 'id',
    data: this.data,
    columns: this.columns,
    noDataText: 'No data found',
    enableGlobalSearch: true,
    enableColumnFilter: true,
    enableExport: true,
    enableColumnToggle: true,
    enableTableViewSize: true,
    enableSorting: true,
    rowHover: true,
    fixedHeaders: true,
    fixedHeadersHeight: '400px',
    gridId: 'exampleTable',
    gridName: 'ExampleGrid',
    loadPageSize: 50,
    exportOptions: [
      { name: 'Export to Excel', icon: 'bi bi-file-earmark-excel', key: 'excel', isIcon: true },
      { name: 'Export to CSV', icon: 'bi bi-file-earmark-text', key: 'csv', isIcon: true }
    ],
    isBatchCallInProgress: false,
    hasBatchCall: false,
    isCustomSelectionOn: false
  };

  onItemSelected(selectedItems: any[]) {
    console.log('Selected:', selectedItems);
  }

  onExport(data: any) {
    console.log('Export:', data);
  }

  onActionClick(action: { action: string; rowData: any }) {
    console.log('Action:', action);
  }
}
```

### Advanced Configuration

```typescript
// Advanced table configuration with all features enabled
const advancedConfig: TableInterface = {
  dataKey: 'id',
  data: yourData,
  columns: yourColumns,
  noDataText: 'No records found',
  
  // Search and Filtering
  enableGlobalSearch: true,
  enableColumnFilter: true,
  enableCustomFilter: true,
  defaultFilterState: TableColumnFilterStateEnum.OPEN,
  
  // Column Management
  enableColumnToggle: true,
  enableColumnResize: true,
  enableColumnReorder: true,
  
  // Sorting
  enableSorting: true,
  sortMode: TableSortModeEnum.MULTIPLE,
  
  // Export
  enableExport: true,
  customExport: false,
  exportOptions: [
    { name: 'Excel', icon: 'bi bi-file-earmark-excel', key: 'excel', isIcon: true },
    { name: 'CSV', icon: 'bi bi-file-earmark-text', key: 'csv', isIcon: true },
    { name: 'PDF', icon: 'bi bi-file-earmark-pdf', key: 'pdf', isIcon: true }
  ],
  
  // Display Options
  enableTableViewSize: true,
  rowHover: true,
  fixedHeaders: true,
  fixedHeadersHeight: '500px',
  
  // Performance
  loaderRows: 20,
  loadPageSize: 100,
  
  // Metadata
  gridId: 'myTable',
  gridName: 'MyTableGrid',
  countEndpointURI: '/api/count',
  listEndpointURI: '/api/list',
  
  // Selection
  isCustomSelectionOn: false,
  hasBatchCall: false,
  isBatchCallInProgress: false
};
```

### Column Configuration Examples

```typescript
// Text column with filtering
{
  name: 'name',
  nameText: 'Name',
  field: 'name',
  filter: true,
  filterType: TableColumnFilterEnum.TEXT,
  sortable: true,
  width: 200,
  isVisible: true,
  showMenu: false
}

// Dropdown column with predefined options
{
  name: 'status',
  nameText: 'Status',
  field: 'status',
  filter: true,
  filterType: TableColumnFilterEnum.DROPDOWN,
  filterValues: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' }
  ],
  sortable: true,
  width: 120,
  isVisible: true,
  showMenu: false,
  cssClasses: 'status-badge'
}

// Date column
{
  name: 'createdDate',
  nameText: 'Created Date',
  field: 'createdDate',
  filter: true,
  filterType: TableColumnFilterEnum.DATE,
  sortable: true,
  width: 150,
  isVisible: true,
  showMenu: false
}

// Checkbox column
{
  name: 'isActive',
  nameText: 'Active',
  field: 'isActive',
  filter: true,
  filterType: TableColumnFilterEnum.CHECK,
  sortable: false,
  width: 80,
  isVisible: true,
  showMenu: false
}

// Custom template column
{
  name: 'actions',
  nameText: 'Actions',
  field: 'actions',
  filter: false,
  sortable: false,
  width: 120,
  isVisible: true,
  showMenu: false,
  template: yourCustomTemplate
}
```

## Event Handlers

The table component emits several events that you can listen to:

```typescript
// Row selection
(itemSelected)="onItemSelected($event)"

// Export functionality
(onExport)="onExport($event)"

// Action buttons (view, edit, delete)
(actionClicked)="onActionClick($event)"

// Column sorting
(sortClicked)="onSort($event)"

// Cell-specific actions
(cellActionClicked)="onCellActionClick($event)"
```

## Styling

The table component uses Bootstrap 5 classes and custom CSS. You can customize the appearance by:

1. **Modifying the component CSS** - Edit `table.component.css`
2. **Using Bootstrap classes** - Apply Bootstrap utility classes
3. **Custom CSS variables** - Override CSS custom properties

### Custom CSS Variables

```css
:root {
  --bs-primary: #0d6efd;
  --bs-secondary: #6c757d;
  --bs-success: #198754;
  --bs-info: #0dcaf0;
  --bs-warning: #ffc107;
  --bs-danger: #dc3545;
  --bs-light: #f8f9fa;
  --bs-dark: #212529;
}
```

## Responsive Design

The table component is fully responsive and includes:

- **Mobile-friendly layout** - Stacks controls vertically on small screens
- **Horizontal scrolling** - Table content scrolls horizontally on mobile
- **Touch-friendly controls** - Larger touch targets for mobile devices
- **Flexible header** - Header adapts to screen size

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

1. **Use pagination** for large datasets
2. **Enable virtual scrolling** for very large datasets
3. **Optimize column widths** to prevent layout shifts
4. **Use appropriate filter types** for better performance
5. **Limit the number of visible columns** on mobile

## Troubleshooting

### Common Issues

1. **Bootstrap not loading** - Ensure Bootstrap CSS is imported in `styles.css`
2. **Icons not showing** - Check that Bootstrap Icons CDN is included in `index.html`
3. **Filtering not working** - Verify column `filter` property is set to `true`
4. **Sorting not working** - Ensure column `sortable` property is set to `true`

### Debug Mode

Enable debug logging by adding this to your component:

```typescript
ngOnInit() {
  console.log('Table config:', this.tableConfig);
  console.log('Columns:', this.columns);
  console.log('Data:', this.data);
}
```

## Contributing

When contributing to the table component:

1. Follow the existing code style
2. Add proper TypeScript types
3. Include unit tests for new features
4. Update documentation for new functionality
5. Test on multiple browsers and screen sizes

## License

This project is licensed under the MIT License.
