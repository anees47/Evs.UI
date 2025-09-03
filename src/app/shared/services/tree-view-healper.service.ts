import { Injectable } from '@angular/core';
import { LevelOptionsDto, TreeDataDto } from '../Modals/TreeViewModels';
import { TreeNode } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class TreeViewHealperService {

  constructor() { }
  // Main method to convert generic data to tree structure
    convertGenericDataToTree<T extends Record<string, any>>(data: TreeDataDto<T>): TreeNode[] {
        // Validate that we have the required data
        if (!data.nodes || !data.nodesOptions) {
            throw new Error('Invalid data: nodes and nodesOptions are required');
        }
        const result: TreeNode[] = [];
        // Set defaults for parent options
        const {
            title: parentLabelField = 'title',
            childrenField: parentChildrenField = '',
            icon: parentIcon = 'bi bi-people-fill',
            description: parentDataFolder = 'Documents Folder',
            useFieldNameAsData: parentUseFieldName = false
        } = data.nodesOptions;

        // Process each parent item
        data.nodes.forEach((parentItem, parentIndex) => {
            // Create parent node
            const parentNode: TreeNode = {
                key: parentIndex.toString(),
                label: String(parentItem[parentLabelField]),
                data: parentUseFieldName && parentChildrenField
                    ? parentChildrenField
                    : parentDataFolder,
                icon: parentIcon,
                ...this.getAdditionalProperties(parentItem),
            };

            // Check if we should add first level children
            if (data.firstLevelChildOptions && parentChildrenField && parentItem[parentChildrenField]) {
                const firstChildData = parentItem[parentChildrenField];

                // Verify first child data is an array
                if (Array.isArray(firstChildData) && firstChildData.length > 0) {
                    parentNode.children = this.processFirstChildLevel(
                        firstChildData,
                        data.firstLevelChildOptions,
                        data.secondLevelChildOptions,
                        `${parentIndex}`
                    );
                }
            }

            // Only add children property if it has items
            if (!parentNode.children || parentNode.children.length === 0) {
                delete parentNode.children;
            }

            result.push(parentNode);
        });

        return result;
    }

    private processFirstChildLevel<T extends Record<string, any>>(
        firstChildData: T[],
        firstChildOptions: LevelOptionsDto,
        secondChildOptions: LevelOptionsDto | null | undefined,
        parentKey: string
    ): TreeNode[] {
        // Set defaults for first child options
        const {
            title: firstLabelField = 'title',
            childrenField: firstChildrenField = '',
            icon: firstIcon = 'bi bi-folder2',
            description: firstDataFolder = 'Documents Folder',
            useFieldNameAsData: firstUseFieldName = false
        } = firstChildOptions;

        return firstChildData.map((firstChildItem, firstChildIndex) => {
            // Determine icon based on file type if available
            let nodeIcon = firstIcon;
            if (firstChildItem['filetype']) {
                nodeIcon = this.getFileIcon(firstChildItem['filetype']);
            }

            const firstChildNode: TreeNode = {
                key: `${parentKey}-${firstChildIndex}`,
                label: String(firstChildItem[firstLabelField]),
                data: firstUseFieldName && firstChildrenField
                    ? firstChildrenField
                    : firstDataFolder,
                icon: nodeIcon,
                ...this.getAdditionalProperties(firstChildItem),
            };

            // Check if we should add second level children
            if (secondChildOptions && firstChildrenField && firstChildItem[firstChildrenField]) {
                const secondChildData = firstChildItem[firstChildrenField];

                // Verify second child data is an array
                if (Array.isArray(secondChildData) && secondChildData.length > 0) {
                    firstChildNode.children = this.processSecondChildLevel(
                        secondChildData,
                        secondChildOptions,
                        `${parentKey}-${firstChildIndex}`
                    );
                }
            }

            // Only add children property if it has items
            if (!firstChildNode.children || firstChildNode.children.length === 0) {
                delete firstChildNode.children;
            }

            return firstChildNode;
        });
    }

    private processSecondChildLevel<T extends Record<string, any>>(
        secondChildData: T[],
        secondChildOptions: LevelOptionsDto,
        parentKey: string
    ): TreeNode[] {
        // Set defaults for second child options
        const {
            title: secondLabelField = 'fileName',
            icon: secondIcon = 'bi bi-file-earmark',
            description: secondDataFolder = 'File',
            useFieldNameAsData: secondUseFieldName = true,
            childrenField: secondChildrenField = ''
        } = secondChildOptions;

        return secondChildData.map((secondChildItem, secondChildIndex) => {
            const secondChildNode: TreeNode = {
                key: `${parentKey}-${secondChildIndex}`,
                label: String(secondChildItem[secondLabelField]),
                data: secondUseFieldName && secondChildrenField
                    ? secondChildrenField
                    : secondDataFolder,
                icon: secondIcon,
                ...this.getAdditionalProperties(secondChildItem),
            };

            return secondChildNode;
        });
    }

    // Helper method to get additional properties excluding specific fields
    private getAdditionalProperties(item: any): any {
        const additional: any = {};
        const excludeFields = ['children'];

        Object.keys(item).forEach(key => {
            if (!excludeFields.includes(key)) {
                additional[key] = item[key];
            }
        });

        return additional;
    }


// Helper to determine icon based on file type
    getFileIcon(fileType: string): string {
        const iconMap: { [key: string]: string } = {
            '.pdf': 'bi bi-file-earmark-pdf',
            '.doc': 'bi bi-file-earmark-word',
            '.docx': 'bi bi-file-earmark-word',
            '.txt': 'bi bi-file-earmark-text',
            '.xlsx': 'bi bi-file-earmark-excel',
            '.xls': 'bi bi-file-earmark-excel',
            '.jpg': 'bi bi-file-earmark-image',
            '.png': 'bi bi-file-earmark-image',
            '.jpeg': 'bi bi-file-earmark-image',
        };

        return iconMap[fileType.toLowerCase()] || 'bi bi-file-earmark';
    }
}
