
import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output, signal, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { UserService } from '../../NewUserInfo/service/userService';
import { NewUserInfo } from '../../NewUserInfo/Modals/NewUserInfoModals';
import { Tooltip } from 'primeng/tooltip';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { SelectButton } from "primeng/selectbutton";
import { FormsModule } from '@angular/forms';
import { PrimeNgTablepComponent } from '../../../shared/components/e2v-table-prime/e2v-table-prime.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ExportFileOptions, TableColumnFilterEnum, TableColumnFilterStateEnum, TableColumnInterface, TableSortModeEnum } from '../../../shared/Modals/TableModals';
import { AppConstants } from '../../../shared/utils/global';
import { ITableAction } from '../../../shared/interfaces/TableInterfaces';
import { AddUpdateUserComponent } from "../../NewUserInfo/components/NewUserInfo/saveUser/add-update-user.component";


@Component({
    templateUrl: './new-user-info-2.component.html',
    styleUrl: './new-user-info-2.component.css',
    standalone: true,
    imports: [TableModule, Tooltip, IconField, InputIcon, SelectButton, FormsModule, TableComponent, AddUpdateUserComponent],
})

export class NewUserInfo2Component implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
    userService = inject(UserService);
    //dt2 = viewChild<TemplateRef<Table>>('dt2');
    @ViewChild('dt2') dt2!: Table<any>;  // ← Add the `!` here
  // Real data from API
  userData: NewUserInfo[] = [];
  selectedSize: any = undefined;
  sizes!: any[];
  TableSortModeEnum = TableSortModeEnum;
  TableColumnFilterStateEnum = TableColumnFilterStateEnum;
  fileExportOptions: ExportFileOptions[] = AppConstants.exportFileOptions
  gridColumns = signal<TableColumnInterface[]>([]);
  selectedColumns: TableColumnInterface[] = [];
  isEditDialogOpen = signal(false);
  addUserDialogOpen = signal(false);

  selectedRowForEdit: any = null;
  //@Output() onExport = new EventEmitter<any>();

  // Column definitions updated for NewUserInfo
    userColumns = [
      {
        width: "50px",
        name: "id",
        nameText: "id",
        sortable: true,
        order: 1,
        field: "id",
        filter: true,
        filterType: TableColumnFilterEnum.TEXT,
        showMenu: true,
        filterValues: [{}],
        isVisible: true,
      },
      {
        width: "50px",
        name: "title",
        nameText: "title",
        sortable: true,
        order: 1,
        field: "title",
        filter: true,
        filterType: TableColumnFilterEnum.TEXT,
        showMenu: true,
        filterValues: [{}],
        isVisible: true,
      },
      {
        width: "50px",
        name: "description",
        nameText: "description",
        sortable: true,
        order: 1,
        field: "description",
        filter: true,
        filterType: TableColumnFilterEnum.TEXT,
        showMenu: true,
        filterValues: [{}],
        isVisible: true,
      },
      // {
      //   width: "50px",
      //   name: "category",
      //   nameText: "category",
      //   sortable: true,
      //   order: 1,
      //   field: "categoryName",
      //   filter: true,
      //   filterType: TableColumnFilterEnum.TEXT,
      //   showMenu: true,
      //   filterValues: [{}],
      //   isVisible: true,
      // },
      {
        width: "50px",
        name: "actions",
        nameText: "actions",
        sortable: true,
        order: 1,
        field: "actions",
        filter: true,
        filterType: TableColumnFilterEnum.TEXT,
        showMenu: true,
        filterValues: [{}],
        isVisible: true,
      }
    ] as unknown as TableColumnInterface[]
        // { field: 'title', header: 'Title', sortable: true, filter: true, width: '140px' },
        // { field: 'description', header: 'Description', sortable: true, filter: true, width: '180px' },
        // { field: 'description', header: 'Description', sortable: true, filter: true, width: '180px' },
        // { field: 'actions', header: 'Actions', sortable: true, filter: true, width: '180px' }] as TableColumnInterface[];
    isSorted = signal<boolean|null>(null);

    ngOnInit() {
          this.gridColumns.set(this.userColumns);
          this.selectedColumns = this.gridColumns();
        // this.productService.getProductsMini().then((data) => {
        //     this.products = data;
        //     this.initialValue = [...data];
        // });
                this.sizes = [
            { name: 'Small', value: 'small' },
            { name: 'Normal', value: undefined },
            { name: 'Large', value: 'large' }
        ];
        this.userData =[
            {
            "id": 6,
            "title": "semi Commercial",
            "description": "Help Center Reference Links: Use the links on the left hand side of this page for FAQs, Glossary, Manuals and Worksheets. The Tutorial section contains a link to the e2ValueUniversity for computer based training. Currently this training is for the Residential valuators and for Pronto Residential and ProntoLite Residential only but we plan to add tutorials for other valuators in the future.\n\nQCE™ - Quick Commercial Estimator – Use for: Commercial properties. This valuator requires information about the structure type, square footage, number of floors, construction type, exterior coverings and roof coverings.\nTypically Used By: Agents and underwriters\n\nQCE Pro™ - Quick Commercial Estimator Pro – Use for: Multiple occupancies and/or different types of construction or HVAC for different sections of a property. This valuator requires information about the structure type, square footage, number of floors and construction type. It allows for multiple exterior coverings, roof coverings and HVAC options.\nTypically Used By: Company field staff and inspection companies\n\nCommercial Pronto – Use for: Commercial properties. This valuator requires the client name and property address. The report includes data scoring, images and a structure valuation.\nTypically Used By: Agents and underwriters\n\nCommercial ProntoLite – Use for: Commercial properties. This valuator requires the client name, property address, structure type and total square footage. The report includes images and a structure valuation.\nTypically Used By: Agents and underwriters\n\nCommercial Contents – Use for: Commercial properties. This valuator requires the client name, property address, occupancy type(s) and square footage for each occupancy type. This tool can be standalone or included in Commercial Pronto or Commercial ProntoLite. The report includes occupancy valuation(s) and images.\nTypically Used By: Agents and underwriters\n\nInVision – Use for: Any type of property. This tool requires the client name and property address. The report provides third party data, including geo-imagery without an e2Value estimate.\nTypically Used By: Agents and underwriters\n\nInQuest – Use for: Any type of property. This tool requires the client name and property address. The report provides third party data only. It does not include geo-imagery or an e2Value estimate.\nTypically Used By: Agents and underwriters\n\n ",
            "categoryId": 1,
            "categoryName": "Product Descriptions updated",
            "isActive": true,
            "totalItems": 6,
            "attachments": [
                {
                    "id": 5,
                    "fileName": "NINJIO Certificate.pdf",
                    "fileType": ".pdf",
                    "storagePath": "\\79bfe587-20bf-4ab1-8fb6-6db8a7cb6233.pdf",
                    "referenceId": 6
                },
                {
                    "id": 6,
                    "fileName": "Avatar.pdf",
                    "fileType": ".pdf",
                    "storagePath": "\\89e4fedc-8f59-42c6-8029-ae3e3f842a62.pdf",
                    "referenceId": 6
                }
            ]
        },
        {
            "id": 5,
            "title": "Commercial",
            "description": "Help Center Reference Links: Use the links on the left hand side of this page for FAQs, Glossary, Manuals and Worksheets. The Tutorial section contains a link to the e2ValueUniversity for computer based training. Currently this training is for the Residential valuators and for Pronto Residential and ProntoLite Residential only but we plan to add tutorials for other valuators in the future.\n\nQCE™ - Quick Commercial Estimator – Use for: Commercial properties. This valuator requires information about the structure type, square footage, number of floors, construction type, exterior coverings and roof coverings.\nTypically Used By: Agents and underwriters\n\nQCE Pro™ - Quick Commercial Estimator Pro – Use for: Multiple occupancies and/or different types of construction or HVAC for different sections of a property. This valuator requires information about the structure type, square footage, number of floors and construction type. It allows for multiple exterior coverings, roof coverings and HVAC options.\nTypically Used By: Company field staff and inspection companies\n\nCommercial Pronto – Use for: Commercial properties. This valuator requires the client name and property address. The report includes data scoring, images and a structure valuation.\nTypically Used By: Agents and underwriters\n\nCommercial ProntoLite – Use for: Commercial properties. This valuator requires the client name, property address, structure type and total square footage. The report includes images and a structure valuation.\nTypically Used By: Agents and underwriters\n\nCommercial Contents – Use for: Commercial properties. This valuator requires the client name, property address, occupancy type(s) and square footage for each occupancy type. This tool can be standalone or included in Commercial Pronto or Commercial ProntoLite. The report includes occupancy valuation(s) and images.\nTypically Used By: Agents and underwriters\n\nInVision – Use for: Any type of property. This tool requires the client name and property address. The report provides third party data, including geo-imagery without an e2Value estimate.\nTypically Used By: Agents and underwriters\n\nInQuest – Use for: Any type of property. This tool requires the client name and property address. The report provides third party data only. It does not include geo-imagery or an e2Value estimate.\nTypically Used By: Agents and underwriters\n\n ",
            "categoryId": 1,
            "categoryName": "Product Descriptions updated",
            "isActive": true,
            "totalItems": 6,
            "attachments": [
                {
                    "id": 3,
                    "fileName": "NINJIO Certificate.pdf",
                    "fileType": ".pdf",
                    "storagePath": "\\31a21768-e438-4a99-af0d-6f12a94c8da6.pdf",
                    "referenceId": 5
                },
                {
                    "id": 4,
                    "fileName": "Avatar.pdf",
                    "fileType": ".pdf",
                    "storagePath": "\\18230d61-d7ad-4bac-92dd-cfe902dfa3cb.pdf",
                    "referenceId": 5
                }
            ]
        },
        {
            "id": 4,
            "title": "Personal Lines",
            "description": "Help Center Reference Links: Use the links on the left hand side of this page for FAQs, Glossary, Manuals and Worksheets. The Tutorial section contains a link to the e2ValueUniversity for computer based training. Currently this training is for the Residential valuators and for Pronto Residential and ProntoLite Residential only but we plan to add tutorials for other valuators in the future.\n\nMainstreet Residential – Use for: Homes of any size or value. This valuator requires basic information about the home, such as square footage, year built, architecture type and roof covering. It does not require interior details of home.\nTypically Used By: Agents and underwriters\n\nMainstreet Residential Pro – Use for: Homes of any size or value. This valuator requires the same information as Residential. However the report displays the cost per square foot and allows the user to adjust that cost. The final report includes the originally calculated replacement value and the adjusted value, if any.\nTypically Used By: Underwriters, company field staff and inspection companies\n\nMainstreet Exterior Residential – Use for: Homes of any size or value. This valuator requires the same information as Residential plus information about exterior features, such as roof pitch, chimneys and windows. The report also provides the cost per square foot.\nTypically Used By: Underwriters, company field staff and inspection companies\n\nMainstreet Full Residential – Use for: Typically used for high-value homes. This valuator requires the same information as Residential plus details about both the exterior and the interior of the home, such as floor coverings, wall coverings, features of the bath(s), kitchen, etc.\nTypically Used By: Company field staff and inspection companies\n\nMainstreet A&A (Additions & Alterations) – Use for: Condos of any size or value where an estimate of the interior build-out is needed and the insured is not responsible for exterior walls, roof and foundation. This valuator requires basic information about the condo, such as square footage, year built and number of rooms.\nTypically Used By: Agents and underwriters\n\nMainstreet A&A Pro (Additions & Alterations) – Use for: Condos of any size or value where an estimate of the interior build-out is needed and the insured is not responsible for exterior walls, roof and foundation. This valuator requires the same information as A&A. However the report displays the cost per square foot and allows the user to adjust that cost. The final report includes the originally calculated replacement value and the adjusted value, if any.\nTypically Used By: Underwriters, company field staff and inspection companies\n\nMainstreet Full A&A (Additions & Alterations) – Use for: Typically used for high-value condos where an estimate of the interior build-out is needed and the insured is not responsible for exterior walls, roof and foundation. This valuator requires the same information as A&A plus additional interior details such as floor coverings, wall coverings, features of the baths, kitchen, etc.\nTypically Used By: Company field staff and inspection companies\n\nMainstreet Additional Structures – Use for: A structure that is not physically attached to the main dwelling, for example pools, garages and gazebos. This valuator requires information about the type of structure, size, year built and type of construction.\nTypically Used By: Agents, underwriters, company field staff and inspection companies\n\nMainstreet Manufactured and Kit Home Valuation Option – Use for: Manufactured and kit homes (Doublewide, Geodesic Dome, Log Kit, Park Model, Quonset Hut, Singlewide and Triplewide). This valuator requires basic information about the home, such as square footage, year built, architecture type and roof covering. It does not require interior details of home.\nTypically Used By: Agents and underwriters\n\nResidential Pronto – Use for: Homes of any size or value. This valuator requires the client name and property address. The report includes data scoring, images and a structure valuation.\nTypically Used By: Agents and underwriters\n\nResidential ProntoLite – Use for: Homes of any size or value. This valuator requires the client name, property address, architectural style of home, living area square footage and year built. The report includes images and a structure valuation.\nTypically Used By: Agents and underwriters\n\nInVision – Use for: Any type of property. This tool requires the client name and property address. The report provides third party data, including geo-imagery without an e2Value estimate.\nTypically Used By: Agents and underwriters\n\nInQuest – Use for: Any type of property. This tool requires the client name and property address. The report provides third party data only. It does not include geo-imagery or an e2Value estimate.\nTypically Used By: Agents and underwriters",
            "categoryId": 1,
            "categoryName": "Product Descriptions updated",
            "isActive": true,
            "totalItems": 6,
            "attachments": [
                {
                    "id": 2,
                    "fileName": "NINJIO Certificate.pdf",
                    "fileType": ".pdf",
                    "storagePath": "\\5915ac95-6fdd-4d94-ada5-cb12f56d87a2.pdf",
                    "referenceId": 4
                }
            ]
        },
        {
            "id": 3,
            "title": "Personal Lines",
            "description": "Help Center Reference Links: Use the links on the left hand side of this page for FAQs, Glossary, Manuals and Worksheets. The Tutorial section contains a link to the e2ValueUniversity for computer based training. Currently this training is for the Residential valuators and for Pronto Residential and ProntoLite Residential only but we plan to add tutorials for other valuators in the future.\n\nMainstreet Residential – Use for: Homes of any size or value. This valuator requires basic information about the home, such as square footage, year built, architecture type and roof covering. It does not require interior details of home.\nTypically Used By: Agents and underwriters\n\nMainstreet Residential Pro – Use for: Homes of any size or value. This valuator requires the same information as Residential. However the report displays the cost per square foot and allows the user to adjust that cost. The final report includes the originally calculated replacement value and the adjusted value, if any.\nTypically Used By: Underwriters, company field staff and inspection companies\n\nMainstreet Exterior Residential – Use for: Homes of any size or value. This valuator requires the same information as Residential plus information about exterior features, such as roof pitch, chimneys and windows. The report also provides the cost per square foot.\nTypically Used By: Underwriters, company field staff and inspection companies\n\nMainstreet Full Residential – Use for: Typically used for high-value homes. This valuator requires the same information as Residential plus details about both the exterior and the interior of the home, such as floor coverings, wall coverings, features of the bath(s), kitchen, etc.\nTypically Used By: Company field staff and inspection companies\n\nMainstreet A&A (Additions & Alterations) – Use for: Condos of any size or value where an estimate of the interior build-out is needed and the insured is not responsible for exterior walls, roof and foundation. This valuator requires basic information about the condo, such as square footage, year built and number of rooms.\nTypically Used By: Agents and underwriters\n\nMainstreet A&A Pro (Additions & Alterations) – Use for: Condos of any size or value where an estimate of the interior build-out is needed and the insured is not responsible for exterior walls, roof and foundation. This valuator requires the same information as A&A. However the report displays the cost per square foot and allows the user to adjust that cost. The final report includes the originally calculated replacement value and the adjusted value, if any.\nTypically Used By: Underwriters, company field staff and inspection companies\n\nMainstreet Full A&A (Additions & Alterations) – Use for: Typically used for high-value condos where an estimate of the interior build-out is needed and the insured is not responsible for exterior walls, roof and foundation. This valuator requires the same information as A&A plus additional interior details such as floor coverings, wall coverings, features of the baths, kitchen, etc.\nTypically Used By: Company field staff and inspection companies\n\nMainstreet Additional Structures – Use for: A structure that is not physically attached to the main dwelling, for example pools, garages and gazebos. This valuator requires information about the type of structure, size, year built and type of construction.\nTypically Used By: Agents, underwriters, company field staff and inspection companies\n\nMainstreet Manufactured and Kit Home Valuation Option – Use for: Manufactured and kit homes (Doublewide, Geodesic Dome, Log Kit, Park Model, Quonset Hut, Singlewide and Triplewide). This valuator requires basic information about the home, such as square footage, year built, architecture type and roof covering. It does not require interior details of home.\nTypically Used By: Agents and underwriters\n\nResidential Pronto – Use for: Homes of any size or value. This valuator requires the client name and property address. The report includes data scoring, images and a structure valuation.\nTypically Used By: Agents and underwriters\n\nResidential ProntoLite – Use for: Homes of any size or value. This valuator requires the client name, property address, architectural style of home, living area square footage and year built. The report includes images and a structure valuation.\nTypically Used By: Agents and underwriters\n\nInVision – Use for: Any type of property. This tool requires the client name and property address. The report provides third party data, including geo-imagery without an e2Value estimate.\nTypically Used By: Agents and underwriters\n\nInQuest – Use for: Any type of property. This tool requires the client name and property address. The report provides third party data only. It does not include geo-imagery or an e2Value estimate.\nTypically Used By: Agents and underwriters",
            "categoryId": 1,
            "categoryName": "Product Descriptions updated",
            "isActive": true,
            "totalItems": 6,
            "attachments": []
        },
        {
            "id": 2,
            "title": "Personal Lines",
            "description": "Help Center Reference Links: Use the links on the left hand side of this page for FAQs, Glossary, Manuals and Worksheets. The Tutorial section contains a link to the e2ValueUniversity for computer based training. Currently this training is for the Residential valuators and for Pronto Residential and ProntoLite Residential only but we plan to add tutorials for other valuators in the future.\n\nMainstreet Residential – Use for: Homes of any size or value. This valuator requires basic information about the home, such as square footage, year built, architecture type and roof covering. It does not require interior details of home.\nTypically Used By: Agents and underwriters\n\nMainstreet Residential Pro – Use for: Homes of any size or value. This valuator requires the same information as Residential. However the report displays the cost per square foot and allows the user to adjust that cost. The final report includes the originally calculated replacement value and the adjusted value, if any.\nTypically Used By: Underwriters, company field staff and inspection companies\n\nMainstreet Exterior Residential – Use for: Homes of any size or value. This valuator requires the same information as Residential plus information about exterior features, such as roof pitch, chimneys and windows. The report also provides the cost per square foot.\nTypically Used By: Underwriters, company field staff and inspection companies\n\nMainstreet Full Residential – Use for: Typically used for high-value homes. This valuator requires the same information as Residential plus details about both the exterior and the interior of the home, such as floor coverings, wall coverings, features of the bath(s), kitchen, etc.\nTypically Used By: Company field staff and inspection companies\n\nMainstreet A&A (Additions & Alterations) – Use for: Condos of any size or value where an estimate of the interior build-out is needed and the insured is not responsible for exterior walls, roof and foundation. This valuator requires basic information about the condo, such as square footage, year built and number of rooms.\nTypically Used By: Agents and underwriters\n\nMainstreet A&A Pro (Additions & Alterations) – Use for: Condos of any size or value where an estimate of the interior build-out is needed and the insured is not responsible for exterior walls, roof and foundation. This valuator requires the same information as A&A. However the report displays the cost per square foot and allows the user to adjust that cost. The final report includes the originally calculated replacement value and the adjusted value, if any.\nTypically Used By: Underwriters, company field staff and inspection companies\n\nMainstreet Full A&A (Additions & Alterations) – Use for: Typically used for high-value condos where an estimate of the interior build-out is needed and the insured is not responsible for exterior walls, roof and foundation. This valuator requires the same information as A&A plus additional interior details such as floor coverings, wall coverings, features of the baths, kitchen, etc.\nTypically Used By: Company field staff and inspection companies\n\nMainstreet Additional Structures – Use for: A structure that is not physically attached to the main dwelling, for example pools, garages and gazebos. This valuator requires information about the type of structure, size, year built and type of construction.\nTypically Used By: Agents, underwriters, company field staff and inspection companies\n\nMainstreet Manufactured and Kit Home Valuation Option – Use for: Manufactured and kit homes (Doublewide, Geodesic Dome, Log Kit, Park Model, Quonset Hut, Singlewide and Triplewide). This valuator requires basic information about the home, such as square footage, year built, architecture type and roof covering. It does not require interior details of home.\nTypically Used By: Agents and underwriters\n\nResidential Pronto – Use for: Homes of any size or value. This valuator requires the client name and property address. The report includes data scoring, images and a structure valuation.\nTypically Used By: Agents and underwriters\n\nResidential ProntoLite – Use for: Homes of any size or value. This valuator requires the client name, property address, architectural style of home, living area square footage and year built. The report includes images and a structure valuation.\nTypically Used By: Agents and underwriters\n\nInVision – Use for: Any type of property. This tool requires the client name and property address. The report provides third party data, including geo-imagery without an e2Value estimate.\nTypically Used By: Agents and underwriters\n\nInQuest – Use for: Any type of property. This tool requires the client name and property address. The report provides third party data only. It does not include geo-imagery or an e2Value estimate.\nTypically Used By: Agents and underwriters",
            "categoryId": 1,
            "categoryName": "Product Descriptions updated",
            "isActive": true,
            "totalItems": 6,
            "attachments": []
        },
        {
            "id": 1,
            "title": " Quarterly Financial Report Test",
            "description": " Quarterly Financial Report Test",
            "categoryId": 1,
            "categoryName": "Product Descriptions updated",
            "isActive": true,
            "totalItems": 6,
            "attachments": [
                {
                    "id": 1,
                    "fileName": "Avatar.pdf",
                    "fileType": ".pdf",
                    "storagePath": "\\7f6e65e8-971d-45fc-aac3-f28eab7c5750.pdf",
                    "referenceId": 1
                },
                {
                    "id": 7,
                    "fileName": "Avatar.pdf",
                    "fileType": ".pdf",
                    "storagePath": "\\73fd93d2-2f01-40f2-879e-594a6901935c.pdf",
                    "referenceId": 1
                }
            ]
        }
      ]as NewUserInfo[];
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
onGlobalFilter(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  this.dt2.filterGlobal(value, 'contains');
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
    debugger
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


}
