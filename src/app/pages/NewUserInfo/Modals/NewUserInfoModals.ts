export interface NewUserInfoAttachment {
  id: number;
  fileName: string;
  fileType: string;
  storagePath: string;
  referenceId: number;
}

export interface NewUserInfo {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  totalItems: number;
  attachments: NewUserInfoAttachment[];
}

export interface SearchNewUserInfosRequestDto {
  title?: string;
  description?: string;
  categoryId?: number;
  subcategoryId?: number;
  categoryName?: string;
  subcategoryName?: string;
  isActive?: boolean;
  pageSize?: number;
  pageNum: number;
}
