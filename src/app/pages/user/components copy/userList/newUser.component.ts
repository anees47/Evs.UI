import { TableColumnInterface, TableInterface, TableSortModeEnum, TableColumnFilterStateEnum, TableColumnFilterEnum } from './../../../../shared/Modals/TableModals';
import { Component, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { AddUpdateUserComponent } from '../saveUser/add-update-user.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSkeletonComponent } from "../../../../shared/components/table-skeleton/table-skeleton/table-skeleton.component";

@Component({
  selector: 'e2v-new-user',
  templateUrl: './newUser.component.html',
  styleUrls: ['./newUser.component.css'],
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule, CommonModule, AddUpdateUserComponent, TableSkeletonComponent]
})
export class NewUserComponent implements OnInit {
  // Dummy data for the table
  userData = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      role: 'admin',
      status: 'Active',
      department: 'Engineering',
      joinDate: '2023-01-15',
      lastLogin: '2024-01-20 10:30:00',
      points: 1250
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      role: 'user',
      status: 'Active',
      department: 'Marketing',
      joinDate: '2023-03-22',
      lastLogin: '2024-01-19 14:15:00',
      points: 890
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'user',
      status: 'Inactive',
      department: 'Sales',
      joinDate: '2023-02-10',
      lastLogin: '2024-01-10 09:45:00',
      points: 650
    },
    {
      id: 4,
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
      role: 'admin',
      status: 'Active',
      department: 'HR',
      joinDate: '2023-04-05',
      lastLogin: '2024-01-20 16:20:00',
      points: 2100
    },
    {
      id: 5,
      name: 'Eve Wilson',
      email: 'eve.wilson@example.com',
      role: 'user',
      status: 'Active',
      department: 'Finance',
      joinDate: '2023-05-18',
      lastLogin: '2024-01-19 11:30:00',
      points: 750
    },
    {
      id: 6,
      name: 'Frank Miller',
      email: 'frank.miller@example.com',
      role: 'user',
      status: 'Active',
      department: 'Engineering',
      joinDate: '2023-06-12',
      lastLogin: '2024-01-20 08:45:00',
      points: 1100
    },
    {
      id: 7,
      name: 'Grace Lee',
      email: 'grace.lee@example.com',
      role: 'user',
      status: 'Inactive',
      department: 'Marketing',
      joinDate: '2023-07-08',
      lastLogin: '2024-01-15 13:20:00',
      points: 420
    },
    {
      id: 8,
      name: 'Henry Davis',
      email: 'henry.davis@example.com',
      role: 'admin',
      status: 'Active',
      department: 'IT',
      joinDate: '2023-08-25',
      lastLogin: '2024-01-20 15:10:00',
      points: 1800
    },
    {
      id: 9,
      name: 'Grace Davis',
      email: 'grace.lee@example.com',
      role: 'user',
      status: 'Inactive',
      department: 'Marketing',
      joinDate: '2023-07-08',
      lastLogin: '2024-01-15 13:20:00',
      points: 420
    },
    {
      id: 10,
      name: 'Henry Lee',
      email: 'henry.davis@example.com',
      role: 'admin',
      status: 'Active',
      department: 'IT',
      joinDate: '2023-08-25',
      lastLogin: '2024-01-20 15:10:00',
      points: 1800
    }
  ];

  // Column definitions
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
      name: 'name',
      nameText: 'Full Name',
      field: 'name',
      filter: true,
      filterType: TableColumnFilterEnum.TEXT,
      sortable: true,
      width: 140,
      isVisible: true,
      showMenu: false
    },
    {
      name: 'email',
      nameText: 'Email Address',
      field: 'email',
      filter: true,
      filterType: TableColumnFilterEnum.TEXT,
      sortable: true,
      width: 180,
      isVisible: true,
      showMenu: false
    },
    {
      name: 'role',
      nameText: 'Role',
      field: 'role',
      filter: true,
      filterType: TableColumnFilterEnum.DROPDOWN,
      filterValues: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' }
      ],
      sortable: true,
      width: 80,
      isVisible: true,
      showMenu: false
    },
    {
      name: 'status',
      nameText: 'Status',
      field: 'status',
      filter: true,
      filterType: TableColumnFilterEnum.DROPDOWN,
      filterValues: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
      ],
      sortable: true,
      width: 80,
      isVisible: true,
      showMenu: false,
      cssClasses: 'status-badge'
    },
    {
      name: 'department',
      nameText: 'Department',
      field: 'department',
      filter: true,
      filterType: TableColumnFilterEnum.DROPDOWN,
      filterValues: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Sales', value: 'Sales' },
        { label: 'HR', value: 'HR' },
        { label: 'Finance', value: 'Finance' },
        { label: 'IT', value: 'IT' }
      ],
      sortable: true,
      width: 100,
      isVisible: true,
      showMenu: false
    },
    {
      name: 'joinDate',
      nameText: 'Join Date',
      field: 'joinDate',
      filter: true,
      filterType: TableColumnFilterEnum.DATE,
      sortable: true,
      width: 100,
      isVisible: true,
      showMenu: false
    },
    {
      name: 'lastLogin',
      nameText: 'Last Login',
      field: 'lastLogin',
      filter: true,
      filterType: TableColumnFilterEnum.TEXT,
      sortable: true,
      width: 120,
      isVisible: true,
      showMenu: false
    },
    {
      name: 'points',
      nameText: 'Points',
      field: 'points',
      filter: true,
      filterType: TableColumnFilterEnum.TEXT,
      sortable: true,
      width: 70,
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

  constructor() { }

  ngOnInit(): void {
    // Simulate loading state
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, 2000);
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

  handleDeleteAction(rowData: any) {
    console.log('Deleting user:', rowData);
    if (confirm(`Are you sure you want to delete ${rowData.name}?`)) {
      // Remove from data array
      const index = this.userData.findIndex(user => user.id === rowData.id);
      if (index !== -1) {
        this.userData.splice(index, 1);
        console.log('User deleted successfully');
      }
    }
  }

  // Edit dialog handlers
  onEditSave(updatedData: any) {
    console.log('Saving updated data:', updatedData);

    // Update the data in the original array
    const index = this.userData.findIndex(user => user.id === updatedData.id);
    if (index !== -1) {
      this.userData[index] = { ...updatedData };
      console.log('User updated successfully');
    }

    this.closeEditDialog();
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
    this.selectedRowForEdit = {};
    this.addUserDialogOpen.set(true);
  }

  closeAddUserDialog() {
    this.addUserDialogOpen.set(false);
  }
}
