import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/userService';
import { Category } from '../../../../../shared/models/category.model';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../../../shared/models/category.dto';

@Component({
  selector: 'e2v-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  categoryForm!: FormGroup;
  isAddingCategory = false;
  editingCategoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCategories();
  }

  initializeForm() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      isActive: [true]
    });
  }

  async loadCategories() {
    try {
      // Use the service to get categories from API
      this.categories = await this.userService.getCategories();
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to mock data if API fails
      this.categories = [
        { id: 1, name: 'Technology', description: 'Technology related categories', isActive: true },
        { id: 2, name: 'Education', description: 'Educational content categories', isActive: true },
        { id: 3, name: 'Business', description: 'Business and management categories', isActive: false },
        { id: 4, name: 'Finance', description: 'Finance and management categories', isActive: false }
      ];
    }
  }

  onAddCategory() {
    this.isAddingCategory = true;
    this.editingCategoryId = null;
    this.categoryForm.reset({ isActive: true });
  }

  onEditCategory(category: any) {
    this.isAddingCategory = true;
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      isActive: category.isActive
    });
  }

  async onSaveCategory() {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value;
      console.log('Form data:', formData);

      try {
        if (this.editingCategoryId) {
          console.log('Updating existing category with ID:', this.editingCategoryId);

          // Update existing category
          const categoryToUpdate: UpdateCategoryDto = {
            id: this.editingCategoryId,
            name: formData.name,
            isActive: formData.isActive
          };

          console.log('Sending update payload:', categoryToUpdate);

          // Call the updateCategory endpoint
          const result = await this.userService.updateCategory(categoryToUpdate);
          console.log('Update API response:', result);

          // Update local data
          const index = this.categories.findIndex(cat => cat.id === this.editingCategoryId);
          if (index !== -1) {
            this.categories[index] = {
              ...this.categories[index],
              name: formData.name,
              isActive: formData.isActive
            };
            console.log('Local data updated successfully');
          }

          console.log('Category updated successfully in database');
        } else {
          console.log('Creating new category');

          // Add new category
          const newCategory: CreateCategoryDto = {
            name: formData.name,
            isActive: formData.isActive
          };

          console.log('Sending create payload:', newCategory);

          const result = await this.userService.createCategory(newCategory);
          console.log('Create API response:', result);

          if (result) {
            this.categories.push(result);
            console.log('New category added to local data');
          }
        }

        this.onCancelEdit();
        console.log('Form closed successfully');
      } catch (error) {
        console.error('Error saving category:', error);
        alert('Failed to save category. Please try again.');
      }
    } else {
      console.log('Form is invalid, marking fields as touched');
      this.markFormGroupTouched();
    }
  }

  onCancelEdit() {
    this.isAddingCategory = false;
    this.editingCategoryId = null;
    this.categoryForm.reset();
  }

  async onDeleteCategory(categoryId: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const result = await this.userService.deleteCategory(categoryId);
        if (result) {
          this.categories = this.categories.filter(cat => cat.id !== categoryId);
          console.log('Category deleted successfully');
        } else {
          alert('Failed to delete category. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      }
    }
  }

  async onToggleStatus(category: any) {
    try {
      console.log('Toggling status for category:', category);
      console.log('Current isActive:', category.isActive);

      // Use the updateCategory method for status updates
      const categoryToUpdate: UpdateCategoryDto = {
        id: category.id,
        name: category.name,
        isActive: !category.isActive
      };

      const result = await this.userService.updateCategory(categoryToUpdate);
      console.log('API response:', result);

      // Update local data only if API call was successful
      category.isActive = !category.isActive;

      console.log('Category status updated successfully. New isActive:', category.isActive);
    } catch (error) {
      console.error('Error updating category status:', error);
      // Don't update local state if API call failed
      alert('Failed to update category status. Please try again.');
    }
  }

  markFormGroupTouched() {
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'This field is required';
      }
      if (field.errors['minlength']) {
        return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `Maximum length is ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }
}
