import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiHandlerService } from '../../../core/services/Base/api-handler.service';
import { ENDPOINTS_CONSTANTS } from '../../../shared/utils/api-EndPoints';
import { NewUserInfo, SearchNewUserInfosRequestDto } from '../Modals/NewUserInfoModals';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../../../shared/models/category.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 private apiService= inject(ApiHandlerService);
  constructor() { }

  // Get all users
  async getNewUserInfos(filter: SearchNewUserInfosRequestDto): Promise<NewUserInfo[]> {
    const response = await lastValueFrom(this.apiService.Get(ENDPOINTS_CONSTANTS.newUserInfo.getAll, filter));
    return response.payload || [];
  }

  // Get user by ID
  async getNewUserInfoById(id: number): Promise<NewUserInfo> {
    const url = `${ENDPOINTS_CONSTANTS.newUserInfo.getById}/${id}`;
    const response = await lastValueFrom(this.apiService.Get(url));
    return response.payload as unknown as NewUserInfo;
  }

  // Create new user
  async createNewUserInfo(userData: Partial<NewUserInfo>): Promise<NewUserInfo> {
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.create, userData));
    return response.payload as unknown as NewUserInfo;
  }

  // Update user
  async updateNewUserInfo(userData: NewUserInfo): Promise<NewUserInfo> {
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.update, userData));
    return response.payload as unknown as NewUserInfo;
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
    const response = await lastValueFrom(this.apiService.Post(url, {}));
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
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.category.update, category));
    return response.payload as unknown as CategoryResponseDto;
  }

  // Delete category
  async deleteCategory(id: number): Promise<boolean> {
    const url = `${ENDPOINTS_CONSTANTS.newUserInfo.category.delete}/${id}`;
    const response = await lastValueFrom(this.apiService.Delete(url));
    return response.isSuccessful;
  }

}
