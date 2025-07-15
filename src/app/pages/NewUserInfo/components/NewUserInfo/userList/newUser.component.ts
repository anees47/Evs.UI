import { Component, OnInit, signal } from '@angular/core';
import { AddUpdateUserComponent } from '../saveUser/add-update-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { TableSkeletonComponent } from '../../../../../shared/components/table-skeleton/table-skeleton/table-skeleton.component';
import { TableColumnFilterEnum, TableColumnFilterStateEnum, TableColumnInterface, TableSortModeEnum } from '../../../../../shared/Modals/TableModals';
import { UserService } from '../../../service/userService';
import { NewUserInfo } from '../../../Modals/NewUserInfoModals';

@Component({
  selector: 'e2v-new-user',
  templateUrl: './newUser.component.html',
  styleUrls: ['./newUser.component.css'],
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule, CommonModule, AddUpdateUserComponent, TableSkeletonComponent]
})
export class NewUserComponent implements OnInit {
  // Real data from API
  userData: NewUserInfo[] = [];

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
      showMenu: false
    },
    {
      name: 'categoryName',
      nameText: 'Category',
      field: 'categoryName',
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
      name: 'storagePath',
      nameText: 'Image',
      field: 'storagePath',
      filter: true,
      filterType: TableColumnFilterEnum.TEXT,
      sortable: true,
      width: 100,
      isVisible: true,
      showMenu: false
    }
  ];

  // Enums for template
  TableSortModeEnum = TableSortModeEnum;
  TableColumnFilterStateEnum = TableColumnFilterStateEnum;

  // Loader state
  loader = false;

  // Edit dialog state
  isEditDialogOpen = signal(false);
  selectedRowForEdit: any = null;

  // Add user dialog state
  addUserDialogOpen = signal(false);

  // Feature flags
  showCheckboxes = false; // Flag to control checkbox visibility - hidden by default

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadNewUserInfos();
  }

  // Load data from API
  async loadNewUserInfos() {
    try {
      this.loader = true;
      this.userData = await this.userService.getNewUserInfos();
    } catch (error) {
      console.error('Error loading new user infos:', error);
      // Handle error appropriately
    } finally {
      this.loader = false;
    }
  }

  // Table action callbacks
  onItemSelected(selectedItems: any[]) {
    console.log('Selected items:', selectedItems);
  }

  onExport(data: any) {
    console.log('Export data:', data);
  }

  onActionClick(action: { action: string; rowData: any }) {
    console.log('Action clicked:', action);
    debugger
    switch (action.action) {
      case 'view':
        this.handleViewAction(action.rowData);
        break;
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

  onSort(sortData: { field: string; direction: string }) {
    console.log('Sort data:', sortData);
  }

  onCellActionClick(cellAction: { field: string; rowData: any }) {
    console.log('Cell action:', cellAction);
  }

  // Action handlers
  handleViewAction(rowData: any) {
    console.log('Viewing user:', rowData);
    // Implement view logic here
    alert(`Viewing user: ${rowData.name}`);
  }

  handleEditAction(rowData: any) {
    console.log('Editing user:', rowData);
    this.selectedRowForEdit = rowData;
    this.isEditDialogOpen.set(true);
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

  // Edit dialog handlers
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
    this.selectedRowForEdit = null;
    this.addUserDialogOpen.set(true);
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

  onAddCancel() {
    console.log('Add cancelled');
    this.closeAddUserDialog();
  }
}
