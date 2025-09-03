import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiHandlerService } from '../../../core/services/Base/api-handler.service';
import { ENDPOINTS_CONSTANTS } from '../../../shared/utils/api-EndPoints';
import { NewUserInfo, SearchNewUserInfosRequestDto, UpdateNewUserInfoRequestDto, CreateNewUserInfoRequestDto } from '../models/new-user-info.model';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../../../shared/models/category.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 private apiService= inject(ApiHandlerService);
  constructor() { }

  // Get all users
  async getNewUserInfos(filter: SearchNewUserInfosRequestDto): Promise<NewUserInfo[]> {
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.getAll, filter));
    return (response.payload || [])as NewUserInfo[];
  }

  // Get user by ID
  async getNewUserInfoById(id: number): Promise<NewUserInfo> {
    const url = `${ENDPOINTS_CONSTANTS.newUserInfo.getById}/${id}`;
    const response = await lastValueFrom(this.apiService.Get(url));
    return response.payload as unknown as NewUserInfo;
  }

  // Create new user
  async createNewUserInfo(userData: Partial<NewUserInfo>): Promise<NewUserInfo> {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('Title', userData.title || '');
    if (userData.description) {
      formData.append('Description', userData.description);
    }
    formData.append('CategoryId', (userData.categoryId || 0).toString());
    if (userData.subcategoryId) {
      formData.append('SubcategoryId', userData.subcategoryId.toString());
    }
    formData.append('IsActive', (userData.isActive ?? true).toString());
    
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.create, formData));
    return response.payload as unknown as NewUserInfo;
  }

  // Create new user with proper DTO
  async createNewUserInfoWithRequest(createRequest: CreateNewUserInfoRequestDto): Promise<NewUserInfo> {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('Title', createRequest.title);
    if (createRequest.description) {
      formData.append('Description', createRequest.description);
    }
    formData.append('CategoryId', createRequest.categoryId.toString());
    if (createRequest.subcategoryId) {
      formData.append('SubcategoryId', createRequest.subcategoryId.toString());
    }
    formData.append('IsActive', createRequest.isActive.toString());
    
    // Add attachments
    if (createRequest.attachments) {
      createRequest.attachments.forEach((file, index) => {
        formData.append(`Attachments`, file);
      });
    }
    
    console.log('Create FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try{
          const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.create, formData));
          return response.payload as unknown as NewUserInfo;
    }
    catch(e){
      console.log(e);
      debugger;
      return null as unknown as NewUserInfo;
    }

  }

  // Update user
  async updateNewUserInfo(userData: NewUserInfo): Promise<NewUserInfo> {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('NewUserInfoId', userData.id.toString());
    formData.append('Title', userData.title);
    formData.append('Description', userData.description);
    formData.append('CategoryId', userData.categoryId.toString());
    formData.append('IsActive', userData.isActive.toString());
    
    const response = await lastValueFrom(this.apiService.Put(ENDPOINTS_CONSTANTS.newUserInfo.update, formData));
    return response.payload as unknown as NewUserInfo;
  }

  // Update user with new request structure
  async updateNewUserInfoWithRequest(updateRequest: UpdateNewUserInfoRequestDto): Promise<NewUserInfo> {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('NewUserInfoId', updateRequest.newUserInfoId.toString());
    formData.append('Title', updateRequest.title);
    formData.append('Description', updateRequest.description);
    formData.append('CategoryId', updateRequest.categoryId.toString());
    formData.append('IsActive', updateRequest.isActive.toString());
    
    // Add attachments
    if (updateRequest.attachments) {
      updateRequest.attachments.forEach((file: File) => {
        formData.append('Attachments', file);
      });
    }
    // Add deleted attachment IDs
    if (updateRequest.deletedAttachmentIds) {
      updateRequest.deletedAttachmentIds.forEach((id: number) => {
        formData.append('DeletedAttachmentIds', id.toString());
      });
    }else {
       formData.append('DeletedAttachmentIds', '');
      }
    
    console.log('Update FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try{
      const response = await lastValueFrom(this.apiService.Put(ENDPOINTS_CONSTANTS.newUserInfo.update, formData));
      return response.payload as unknown as NewUserInfo;
    }
    catch(e){
      console.log(e);
      return {} as NewUserInfo
    }
  }

  // Delete user
  async deleteNewUserInfo(id: number): Promise<boolean> {
    const url = `${ENDPOINTS_CONSTANTS.newUserInfo.delete}/${id}`;
    const response = await lastValueFrom(this.apiService.Delete(url));
    return response.isSuccessful;
  }

  // Get categories
  async getCategories(activeOnly: boolean = true): Promise<CategoryResponseDto[]> {
    const url = `${ENDPOINTS_CONSTANTS.newUserInfo.category.getAll}/${activeOnly}`;
    const response = await lastValueFrom(this.apiService.Get(url, {}));
    return response.payload || [];
  }

  // Get category by ID
  async getCategoryById(id: number): Promise<CategoryResponseDto> {
    const url = `${ENDPOINTS_CONSTANTS.newUserInfo.category.getById}/${id}`;
    const response = await lastValueFrom(this.apiService.Get(url));
    return response.payload as unknown as CategoryResponseDto;
  }
    // Create category
  async createCategory(category: CreateCategoryDto): Promise<CategoryResponseDto> {
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.category.create, category));
    return response.payload as unknown as CategoryResponseDto;
  }
    // Update category
  async updateCategory(category: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const response = await lastValueFrom(this.apiService.Put(ENDPOINTS_CONSTANTS.newUserInfo.category.update, category));
    return response.payload as unknown as CategoryResponseDto;
  }

  // Delete category
  async deleteCategory(id: number): Promise<boolean> {
    const url = `${ENDPOINTS_CONSTANTS.newUserInfo.category.delete}/${id}`;
    const response = await lastValueFrom(this.apiService.Delete(url));
    return response.isSuccessful;
  }

}
