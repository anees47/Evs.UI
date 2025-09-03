import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { Tree } from 'primeng/tree';
import { ToastModule } from 'primeng/toast';
import { MessageService, TreeNode } from 'primeng/api';
import { TreeViewHealperService } from '../../services/tree-view-healper.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-tree-view',
  imports: [Tree, ToastModule,TooltipModule],
  providers: [MessageService],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.css'
})
export class TreeViewComponent implements OnInit {

  files!: TreeNode[];
  selectedFile!: TreeNode;

  // Input to receive tree data from parent component
  // Using 'input' decorator to allow parent component to pass data
    dataList = input.required<any>();
    @Output() itemSelected = new EventEmitter<any[]>();
    expanded =  false;
    expandedToggleText = signal('Expand All');
    expendedToggleIcon = signal('pi pi-plus');

    //injected TreeViewHelperService to convert data to tree structure
    treeViewService = inject(TreeViewHealperService);

    //constructor(private messageService: MessageService) {}

    ngOnInit() {
        // Initialize the tree data when component loads
        debugger
        const inputData = this.dataList();
        if (inputData) {
            this.files = this.treeViewService.convertGenericDataToTree(inputData);
        }
    }

    nodeExpand(event: any) {
    }

    nodeCollapse(event: any) {
    }

    nodeSelect(event: any) {
        //this.messageService.add({ severity: 'info', summary: 'Node Selected',  detail: event.node.label});
        this.itemSelected.emit(event);

    }

    nodeUnselect(event: any) {
  }

    toggleAllNodes(): void {
      this.expanded = !this.expanded;
      this.expandedToggleText.set(this.expanded ? 'Collapse All' : 'Expand All');
      this.expendedToggleIcon.set(this.expanded ? 'pi pi-minus' : 'pi pi-plus');
      if (this.expanded) {
        this.expandAll();
    } else {
        this.collapseAll();
    }
    }
    expandAll() {
      this.files.forEach((node) => {
            this.expandRecursive(node, true);
      });
    }

    collapseAll() {
        this.files.forEach((node) => {
            this.expandRecursive(node, false);
        });
    }

    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        debugger
        if (node.children) {
            node.children.forEach((childNode) => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }



}
