import {Component, effect, Inject, input, OnDestroy, output, signal, viewChild,} from '@angular/core';
import {ColumnFilter, TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
// import {GridViewVm, TableInterface, TableViewSizes,} from '../../interfaces/table/table.interface';
import {InputTextModule} from 'primeng/inputtext';
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {MultiSelectModule} from 'primeng/multiselect';
import {CheckboxModule} from 'primeng/checkbox';
import {SkeletonModule} from 'primeng/skeleton';
import {SelectModule} from 'primeng/select';
import {TooltipModule} from 'primeng/tooltip';
// import {TableColumnInterface} from '../../interfaces/table/table-column.interface';
// import {TableColumnFilterEnum, TableColumnFilterStateEnum,} from '../../enums/table/table-column-filter.enum';
// import {ResolvePipe} from '../../pipes/resolve.pipe';
// import {AppConstants, AppTokens} from '../../utils/global';
// import {MultiSelectComponent} from '../multi-select/multi-select.component';
// import {MultiSelectDisplayEnums} from '../../enums/multi-select/multi-select.enums';
// import {SelectButtonComponent} from '../select-button/select-button.component';
// import {CheckboxComponent} from '../checkbox/checkbox.component';
// import {DropdownComponent} from '../dropdown/dropdown.component';
// import {GridFilterComponent} from '../grid-filter/grid-filter.component';
// import {orderBy} from 'lodash';
import {Popover, PopoverModule} from 'primeng/popover';
import {CalendarModule} from 'primeng/calendar';
// import {FileExportService} from '../../services/export-file/export-file.service';
// import {GridFilterDialogComponent} from '../grid-custom-filter/grid-custom-filter.component';
// import {CustomFilterDialogAction} from '../../enums/custom-filter/custom-filter-dialog.enum';
// import {ToasterTypeEnum} from '../../enums/toaster-type.enum';
// import {IToaster} from '../../interfaces/toaster/IToaster';
// import {FileExportComponent} from '../file-export/file-export.component';
// import {LiveFilterService} from '../../services/live-filtering/live-filtering.service';
// import {ResizableColumnService} from '../../services/resize-column.service.ts/resize-column.service';
// import {ITableAction} from '../../interfaces/table/ITableAction.interface';
import {SelectItem} from 'primeng/api';
// import {CustomDateFilterService} from '../../services/table-date-filter/custom-date-filter.service';
// import {ITableColOrder, ITableColVisibility} from '../../interfaces/table/ITableColOrder.interface';
import {CommonModule} from '@angular/common';
// import {ResolveClassPipe} from '../../pipes/resolveClass.pipe';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
// import {SanitizePipe} from "../../pipes/sanitize.pipe";
import {RatingModule} from 'primeng/rating';
import {AvatarModule} from 'primeng/avatar';
// import {AppUtils} from '../../utils/app-utilities';
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import { TableColumnFilterEnum, TableColumnInterface, TableInterface } from '../../Modals/TableModals';
import { ITableAction } from '../../interfaces/TableInterfaces';
import { FileExportService } from '../../services/file-export.service';
import { FileExportComponent } from "../file-export/file-export.component";
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'calimatic-table',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    SelectButtonModule,
    FormsModule,
    MultiSelectModule,
    CheckboxModule,
    SkeletonModule,
    SelectModule,
    TooltipModule,
    // MultiSelectComponent,
    // SelectButtonComponent,
    // CheckboxComponent,
    // DropdownComponent,
    // GridFilterComponent,
    PopoverModule,
    CalendarModule,
    // GridFilterDialogComponent,
    // FileExportComponent,
    CommonModule,
    ToggleSwitchModule,
    RatingModule,
    AvatarModule,
    IconField,
    InputIcon,
    DropdownModule,
    CommonModule,
    FileExportComponent
],
  templateUrl: './e2v-table-prime.component.html',
  styleUrl: './e2v-table-prime.component.scss',
})
export class PrimeNgTablepComponent implements OnDestroy {
  //signals
  itemSelected = output<any>();
  onExport = output<any>();
  actionClicked = output<{ action: ITableAction; rowData: any; }>();
  configs = input.required<Partial<TableInterface>>();
  Popover = viewChild.required<Popover>('op');
  customFilterList = signal<any[]>([]);
  //gridFilter = viewChild.required<GridFilterComponent>(GridFilterComponent);

  //vars
  readonly tableViewSizes = [
    {name: 'Small', class: 'table-sm', icon: 'bi bi-grid-3x3'},
    {name: 'Medium', class: '', icon: 'bi bi-grid'},
    {name: 'Large', class: 'table-lg', icon: 'bi bi-grid-1x2'}
  ];

  selectedSize = '';
  toggleFilter: boolean = false;
  selectedColumns: TableColumnInterface[] | undefined;
  gridColumns: TableColumnInterface[] | undefined;
  globalFilterFields: string[] = [];
  isLoading: boolean = true;
  gridData: any[] = [];
  gridFilteredData: any[] = [];
  filterTypes = TableColumnFilterEnum;
  selectedListItems: any[] = [];
  dateMatchModeOptions: SelectItem[] = [];
  filteredData: any;  constructor(
    private fileExportService: FileExportService,
  ) {
      effect(() => {
        this.loadData(this.configs().data);
      });
  }

  //Load data from parent
  loadData(data: any) {
    this.gridColumns = this.configs().columns;
    this.selectedColumns = (this.gridColumns || []).filter(x => x.isVisible);
    this.globalFilterFields = (this.gridColumns || []).map((x) => x.name);
    this.gridData = this.gridFilteredData = data || [];
    this.isLoading = false;
  }


  onDataExport({key}: any) {
    if (this.configs().customExport) {
      this.onExport.emit({key: key, gridName: this.configs().gridName, data: this.filteredData});
    } else {
      this.fileExportService.onDataExport(
        key,
        this.configs().gridName ?? 'export',
        this.filteredData,
        this.selectedColumns??[]
      );
    }
  }

  ngOnDestroy() {
    this.fileExportService.close();
  }

  //select all table rows
  selectAllItems(event: any) {
    this.selectedListItems = [];
    if (event) {
      this.gridData.forEach((item) => {
        item.selected = true;
        this.selectedListItems.push(item);
      });
    } else {
      this.gridData.forEach((item) => (item.selected = false));
    }
    this.emitSelectedItems();
  }

  //select single row
  checkBoxValueChange(event: any, selectedItem: any) {
    if (event) {
      this.selectedListItems.push(selectedItem);
    } else {
      const index = this.selectedListItems.indexOf(selectedItem);
      if (index !== -1) {
        this.selectedListItems.splice(index, 1);
      }
    }
    this.emitSelectedItems();
  }




  //action callback
  onActionClick(action: ITableAction, rowData: any) {
    if (action) {
      this.actionClicked.emit({action, rowData});
    }
  }

  colCheckBoxValueChange(event: any, action: any, colName: string, callBack: any) {
    action[colName] = event;
    if (typeof callBack === 'function') {
      callBack(action);  //callBack.action.callback
    } else if (callBack && typeof callBack.emit === 'function') {
      callBack.emit(action);
    } else {
      this.itemSelected.emit(action);
    }
  }


  onFilter(evt: any) {
    this.filteredData = evt?.filteredValue;
  }

  view(event: any, callBack: any, data: any) {

    if (typeof callBack === 'function') {
      callBack(data);  //callBack.action.callback
    } else if (callBack && typeof callBack.emit === 'function') {
      callBack.emit(data);
    } else {
      this.itemSelected.emit(data);
    }
  }

  //emit selected rows to parent
  private emitSelectedItems() {
    this.itemSelected.emit(this.selectedListItems);
  }
}
