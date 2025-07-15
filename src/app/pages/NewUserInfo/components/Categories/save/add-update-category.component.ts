import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../../../../shared/models/category.model';

@Component({
  selector: 'e2v-add-update-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-update-category.component.html',
  styleUrls: ['./add-update-category.component.css']
})
export class AddUpdateCategoryComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() rowData: Category | null = null;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<Category>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  editForm!: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rowData'] && this.rowData && this.editForm) {
      this.populateForm();
    }
  }

  createForm() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      isActive: [true]
    });
  }

  populateForm() {
    if (this.editForm && this.rowData) {
      this.editForm.patchValue({
        name: this.rowData.name || '',
        isActive: this.rowData.isActive ?? true
      });
    }
  }

  async onSave() {
    if (this.editForm.valid) {
      try {
        this.isLoading = true;
        const formData = this.editForm.value;
        
        if (this.isEditMode && this.rowData) {
          // Update existing category
          const updatedData: Category = {
            ...this.rowData,
            ...formData
          };
          this.save.emit(updatedData);
        } else {
          // Create new category
          const newData: Partial<Category> = {
            ...formData,
            id: 0 // Will be assigned by backend
          };
          this.save.emit(newData as Category);
        }
      } catch (error) {
        console.error('Error saving category:', error);
        // Handle error appropriately
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  markFormGroupTouched() {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'This field is required';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Minimum length is ${requiredLength} characters`;
      }
    }
    return '';
  }

  // Helper method to get form field value
  getFieldValue(fieldName: string): any {
    return this.editForm.get(fieldName)?.value;
  }
} 