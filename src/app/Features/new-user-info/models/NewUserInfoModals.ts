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
  subcategoryId?: number;
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

export interface UpdateNewUserInfoRequestDto {
  newUserInfoId: number;
  title: string;
  description: string;
  categoryId: number;
  isActive: boolean;
  attachments?: File[];
  deletedAttachmentIds: number[];
}

export interface CreateNewUserInfoRequestDto {
  title: string;
  description?: string;
  categoryId: number;
  subcategoryId?: number;
  isActive: boolean;
  attachments?: File[];
}
