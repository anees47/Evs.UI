// Category DTOs for API operations

export interface CreateCategoryDto {
  name: string;
  isActive: boolean;
}

export interface UpdateCategoryDto {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CategoryResponseDto {
  id: number;
  name: string;
  isActive: boolean;
} 