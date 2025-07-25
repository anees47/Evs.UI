
import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output, signal, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { UserService } from '../../NewUserInfo/service/userService';
import { NewUserInfo, SearchNewUserInfosRequestDto } from '../../NewUserInfo/Modals/NewUserInfoModals';
import { Tooltip } from 'primeng/tooltip';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { SelectButton } from "primeng/selectbutton";
import { FormsModule } from '@angular/forms';
import { ExportFileOptions, TableColumnFilterEnum, TableColumnFilterStateEnum, TableColumnInterface, TableSortModeEnum } from '../../../shared/Modals/TableModals';
import { AppConstants } from '../../../shared/utils/global';
import { ITableAction } from '../../../shared/interfaces/TableInterfaces';
import { AddUpdateUserComponent } from "../../NewUserInfo/components/NewUserInfo/saveUser/add-update-user.component";
import { CommonModule } from '@angular/common';
import { TableSkeletonComponent } from "../../../shared/components/table-skeleton/table-skeleton/table-skeleton.component";
import { Tag } from 'primeng/tag';
import { Button } from "primeng/button";


@Component({
    templateUrl: './new-user-info-2.component.html',
    styleUrl: './new-user-info-2.component.css',
    standalone: true,
    imports: [Tag, TableModule, Tooltip, IconField, InputIcon, SelectButton, FormsModule, AddUpdateUserComponent, CommonModule, TableSkeletonComponent,Button],
})

export class NewUserInfo2Component implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  //--Services
    userService = inject(UserService);

  //--ViewChild variables
    @ViewChild('dt2') dt2!: Table<any>;  // ← Add the `!` here

  //variables
  sizes!: any[];
  selectedSize: any = undefined;
  selectedRowForEdit: any = null;
  userData: NewUserInfo[] = [];

  TableSortModeEnum = TableSortModeEnum;
  globalFilterFields: string[] = [];
  selectedColumns: TableColumnInterface[] = [];
  TableColumnFilterStateEnum = TableColumnFilterStateEnum;
  fileExportOptions: ExportFileOptions[] = AppConstants.exportFileOptions
  searchUser: SearchNewUserInfosRequestDto = { pageNum: 1 }; // Fixed typo and initialized with required property

  //signals
  isSorted = signal<boolean|null>(null);
  gridColumns = signal<TableColumnInterface[]>([]);
  isEditDialogOpen = signal(false);
  addUserDialogOpen = signal(false);
  loader = signal(false);

  //@Output() onExport = new EventEmitter<any>();

  // Column definitions updated for NewUserInfo
    userColumns: TableColumnInterface[] = [
    {
      name: 'id',
      nameText: 'ID',
      field: 'id',
      filter: true,
      filterType: TableColumnFilterEnum.TEXT,
      sortable: true,
      width: 50,
      isVisible: true,
      showMenu: false
    },
    {
      name: 'title',
      nameText: 'Title',
      field: 'title',
      filter: true,
      filterType: TableColumnFilterEnum.TEXT,
      sortable: true,
      width: 140,
      isVisible: true,
      showMenu: false
    },
    {
      name: 'description',
      nameText: 'Description',
      field: 'description',
      filter: true,
      filterType: TableColumnFilterEnum.TEXT,
      sortable: true,
      width: 180,
      isVisible: true,
      showMenu: false,
      //template: this.desctipionTemplate()
    },
    {
      name: 'category',
      nameText: 'Category Name',
      field: 'category',
      filter: true,
      filterType: TableColumnFilterEnum.TEXT,
      sortable: true,
      width: 100,
      isVisible: true,
      showMenu: false
    },
    {
      name: 'isActive',
      nameText: 'Status',
      field: 'isActive',
      filter: true,
      filterType: TableColumnFilterEnum.DROPDOWN,
      filterValues: [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
      ],
      sortable: true,
      width: 80,
      isVisible: true,
      showMenu: false,
      cssClasses: 'status-badge'
    },
    {
      name: 'actions',
      nameText: 'Actions',
      field: 'actions',
      filter: false,
      filterType: TableColumnFilterEnum.NONE,
      sortable: true,
      width: 100,
      isVisible: true,
      showMenu: false
    }
  ];

    ngOnInit() {
          this.gridColumns.set(this.userColumns);
          this.selectedColumns = this.gridColumns();
          this.updateGlobalFilterFields()
          this.sizes = [
            {name: 'Small',  value: 'small',  class: 'table-sm', icon: 'bi bi-grid-3x3'},
            {name: 'Medium', value: undefined , class: '', icon: 'bi bi-grid'},
            {name: 'Large',  value: 'large',  class: 'table-lg', icon: 'bi bi-grid-1x2'}
          ];
           this.loadNewUserInfos();
    }
    
    async loadNewUserInfos() {
        try {
          this.loader.set(true);

          // Create complete payload with all properties
          const completePayload: SearchNewUserInfosRequestDto = {
            title: this.searchUser.title || undefined,
            description: this.searchUser.description || undefined,
            categoryId: this.searchUser.categoryId || undefined,
            subcategoryId: this.searchUser.subcategoryId || undefined,
            categoryName: this.searchUser.categoryName || undefined,
            subcategoryName: this.searchUser.subcategoryName || undefined,
            isActive: this.searchUser.isActive !== undefined ? this.searchUser.isActive : undefined,
            pageSize: this.searchUser.pageSize || undefined,
            pageNum: this.searchUser.pageNum || 1
          };

          this.userData = await this.userService.getNewUserInfos(completePayload);
        } catch (error) {
          console.error('Error loading new user infos:', error);
          // Handle error appropriately
        } finally {
          this.loader.set(false);
        }
      }


    customSort(event: SortEvent) {
        if (this.isSorted() == null ) {
            this.isSorted.set(true);
            this.sortTableData(event);
        } else if (this.isSorted()) {
            this.isSorted.set(false);
            this.sortTableData(event);
        } else if (this.isSorted() == false) {
            this.isSorted.set(null);
            //this.products = [...this.initialValue];
            //this.dt.clear();
        }
    }
  handleTableAction(event: { action: ITableAction, rowData: any }) {
    if (event.action.callback) {
      event.action.callback(event.rowData);
    }
  }

    sortTableData(event:any) {
        event.data.sort((data1:any, data2:any) => {
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            let result = null;
            if (value1 == null && value2 != null) result = -1;
            else if (value1 != null && value2 == null) result = 1;
            else if (value1 == null && value2 == null) result = 0;
            else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
            else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

            return event.order * result;
        });
    }

 // Table view size
  onTableViewSizeChange(size: string) {
    this.selectedSize = size;
  }
  onExportClick() {
    const data = this.userData;
    const exportData = {
      data: data,
      columns: this.selectedColumns,
      fileName: `${'table-data'}-${new Date().toISOString().split('T')[0]}`

      //fileName: `${this.configs.gridName || 'table-data'}-${new Date().toISOString().split('T')[0]}`
    };
    //this.onExport.emit(exportData);

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

  onColumnVisibilityChange(event: Event, column: TableColumnInterface) {
    const target = event.target as HTMLInputElement;
    if (target) {
      column.isVisible = target.checked;
      this.selectedColumns = this.gridColumns().filter(col => col.isVisible !== false);
      this.cdr.detectChanges();
    }
  }
  onActionClick(action: { action: string; rowData: any }) {
    switch (action.action) {

      case 'edit':
        this.handleEditAction(action.rowData);
        break;
      case 'delete':
        this.handleDeleteAction(action.rowData);
        break;
      default:
        console.log('Unknown action:', action.action);
    }
  }
  handleEditAction(rowData: any) {
    this.isEditDialogOpen.set(true);
    console.log('Editing user:', rowData);
    this.selectedRowForEdit = rowData;

  }
  async handleDeleteAction(rowData: NewUserInfo) {
    console.log('Deleting user:', rowData);
    if (confirm(`Are you sure you want to delete ${rowData.title}?`)) {
      try {
        const success = await this.userService.deleteNewUserInfo(rowData.id);
        if (success) {
          // Remove from data array
          const index = this.userData.findIndex(user => user.id === rowData.id);
          if (index !== -1) {
            this.userData.splice(index, 1);
            console.log('User deleted successfully');
          }
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }


  onAddCancel() {
    this.closeAddUserDialog();
  }

  async onEditSave(updatedData: NewUserInfo) {
    try {
      console.log('Saving updated data:', updatedData);

      // Update the data in the original array
      const index = this.userData.findIndex(user => user.id === updatedData.id);
      if (index !== -1) {
        this.userData[index] = { ...updatedData };
        console.log('User updated successfully');
      }

      this.closeEditDialog();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  onEditCancel() {
    console.log('Edit cancelled');
    this.closeEditDialog();
  }

  closeEditDialog() {
    this.isEditDialogOpen.set(false);
    this.selectedRowForEdit = null;
  }

  openAddUserDialog() {
    this.addUserDialogOpen.set(true);
    this.selectedRowForEdit = null;

  }

  closeAddUserDialog() {
    this.addUserDialogOpen.set(false);
  }

  async onAddSave(newData: NewUserInfo) {
    try {
      console.log('Saving new data:', newData);

      // Add the new data to the array
      this.userData.push(newData);
      console.log('User added successfully');

      this.closeAddUserDialog();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

updateGlobalFilterFields(): void {

  this.globalFilterFields = this.selectedColumns
    .map(col => col.field)
    .filter((field): field is string => typeof field === 'string');
}

onGlobalFilter(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  this.dt2.filterGlobal(value, 'contains');
}


}
