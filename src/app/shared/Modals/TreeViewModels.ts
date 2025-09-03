
interface TreeNode {
  key: string;
  label: string;
  data: string;
  icon: string;
  children?: TreeNode[];
  [key: string]: any; // Allow additional properties
}


// DTO for level options
export interface LevelOptionsDto {
  title?: string;
  childrenField?: string;
  icon?: string;
  description?: string;
  useFieldNameAsData?: boolean;
}

export interface TreeDataDto<T extends Record<string, any>> {
  nodes: T[];
  nodesOptions: LevelOptionsDto;
  firstLevelChildOptions: LevelOptionsDto;
  secondLevelChildOptions?: LevelOptionsDto | null;
  parentKey: string;
}


