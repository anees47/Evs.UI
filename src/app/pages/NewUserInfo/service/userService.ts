import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { ApiHandlerService } from '../../../core/services/Base/api-handler.service';
import { ENDPOINTS_CONSTANTS } from '../../../shared/utils/api-EndPoints';
import { NewUserInfo } from '../Modals/NewUserInfoModals';
import { Category } from '../../../shared/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private apiService: ApiHandlerService
  ) { }

  // Get all users
  async getNewUserInfos(filter: any = {}): Promise<NewUserInfo[]> {
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.getAll, filter));
    return response.payload || [];
  }

  // Get user by ID
  async getNewUserInfoById(id: number): Promise<NewUserInfo> {
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.getById, { id }));
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
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.delete, { id }));
    return response.isSuccessful;
  }

  // Get categories
  async getCategories(): Promise<any[]> {
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.category.getAll, {}));
    return response.payload || [];
  }
    // Get categories
  async createCategory(category : Category): Promise<any[]> {
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.category.create, category));
    return response.payload || [];
  }
    // Get categories
  async updateCategory(category : Category): Promise<any[]> {
    const response = await lastValueFrom(this.apiService.Post(ENDPOINTS_CONSTANTS.newUserInfo.category.update, category));
    return response.payload || [];
  }

}
