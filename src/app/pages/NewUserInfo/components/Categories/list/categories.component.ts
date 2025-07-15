import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/userService';
import { Category } from '../../../../../shared/models/category.model';

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
      description: ['', Validators.maxLength(200)],
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
      description: category.description,
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
          const categoryToUpdate: Category = {
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
              description: formData.description,
              isActive: formData.isActive 
            };
            console.log('Local data updated successfully');
          }

          console.log('Category updated successfully in database');
        } else {
          console.log('Creating new category');
          
          // Add new category
          const newCategory: Category = {
            id: 0, // Will be assigned by backend
            name: formData.name,
            isActive: formData.isActive
          };

          console.log('Sending create payload:', newCategory);
          
          const result = await this.userService.createCategory(newCategory);
          console.log('Create API response:', result);
          
          if (result && result.length > 0) {
            this.categories.push(result[0]);
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
        // Note: You might need to add a deleteCategory method to UserService
        // For now, just remove from local array
        this.categories = this.categories.filter(cat => cat.id !== categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  }

  async onToggleStatus(category: any) {
    try {
      console.log('Toggling status for category:', category);
      console.log('Current isActive:', category.isActive);
      
      // Prepare the payload as per your specification
      const categoryToUpdate: Category = {
        id: category.id,
        name: category.name,
        isActive: !category.isActive
      };
      
      console.log('Sending payload:', categoryToUpdate);

      // Call the API to update the status
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
