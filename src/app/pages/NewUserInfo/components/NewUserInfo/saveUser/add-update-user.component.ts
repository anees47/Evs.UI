import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableColumnInterface } from '../../../../../shared/Modals/TableModals';
import { NewUserInfo, NewUserInfoAttachment } from '../../../Modals/NewUserInfoModals';
import { UserService } from '../../../service/userService';

@Component({
  selector: 'e2v-add-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-update-user.component.html',
  styleUrls: ['./add-update-user.component.css']
})
export class AddUpdateUserComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() rowData: NewUserInfo | null = null;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<NewUserInfo>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  editForm!: FormGroup;
  isLoading = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  // Category autocomplete properties
  categorySuggestions: any[] = [];
  showCategoryDropdown = false;
  selectedCategory: any = null;

  // Sample category data - replace with actual API call
  availableCategories = [
    { id: 1, name: 'Technology', description: 'Technology related content' },
    { id: 2, name: 'Business', description: 'Business and management content' },
    { id: 3, name: 'Education', description: 'Educational materials' },
    { id: 4, name: 'Health', description: 'Health and wellness content' },
    { id: 5, name: 'Finance', description: 'Financial and investment content' },
    { id: 6, name: 'Marketing', description: 'Marketing and advertising content' },
    { id: 7, name: 'Design', description: 'Design and creative content' },
    { id: 8, name: 'Science', description: 'Scientific research and content' },
    { id: 9, name: 'Sports', description: 'Sports and fitness content' },
    { id: 10, name: 'Entertainment', description: 'Entertainment and media content' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rowData'] && this.rowData && this.editForm) {
      this.populateForm();
    }
  }

  createForm() {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', [Validators.required]],
      categoryName: ['', [Validators.required]],
      isActive: [true],
      totalItems: [0, [Validators.required, Validators.min(0)]],
      attachments: this.fb.array([])
    });

    // Add listener for category name changes
    this.editForm.get('categoryName')?.valueChanges.subscribe(value => {
      this.onCategoryNameChange(value);
    });
  }

  populateForm() {
    if (this.editForm && this.rowData) {
      this.editForm.patchValue({
        title: this.rowData.title || '',
        description: this.rowData.description || '',
        categoryId: this.rowData.categoryId || '',
        categoryName: this.rowData.categoryName || '',
        isActive: this.rowData.isActive ?? true,
        totalItems: this.rowData.totalItems || 0
      });

      // Set selected category if editing
      if (this.rowData.categoryId && this.rowData.categoryName) {
        this.selectedCategory = {
          id: this.rowData.categoryId,
          name: this.rowData.categoryName
        };
      }

      // Populate attachments if they exist
      if (this.rowData.attachments && this.rowData.attachments.length > 0) {
        this.populateAttachments();
      }
    }
  }

  populateAttachments() {
    if (this.rowData?.attachments) {
      const attachmentsArray = this.editForm.get('attachments') as FormArray;
      attachmentsArray.clear();
      
      this.rowData.attachments.forEach(attachment => {
        attachmentsArray.push(this.fb.group({
          id: [attachment.id],
          fileName: [attachment.fileName],
          fileType: [attachment.fileType],
          storagePath: [attachment.storagePath],
          referenceId: [attachment.referenceId]
        }));
      });
    }
  }

  // File upload methods
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (this.isValidFile(file)) {
          this.selectedFiles.push(file);
          this.createPreview(file);
        }
      }
    }
  }

  isValidFile(file: File): boolean {
    const allowedTypes = ['application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert(`File ${file.name} is not a valid PDF file. Please upload PDF files only.`);
      return false;
    }

    if (file.size > maxSize) {
      alert(`File ${file.name} is too large. Maximum size is 10MB.`);
      return false;
    }

    return true;
  }

  createPreview(file: File) {
    // For PDF files, we'll use a PDF icon instead of preview
    this.previewUrls.push('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDVIMzBWMzVIMTBWNVoiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0xNSAxNUgyNVYxOEgxNVYxNVoiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZD0iTTE1IDIwSDI1VjIzSDE1VjIwWiIgZmlsbD0iIzMzMzMzMyIvPgo8cGF0aCBkPSJNMTUgMjVIMjVWMjhIMTVWMjVaIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik0xNSAzMEgyNVYzM0gxNVYzMFoiIGZpbGw9IiMzMzMzMzMiLz4KPC9zdmc+');
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  removeExistingAttachment(index: number) {
    const attachmentsArray = this.editForm.get('attachments') as FormArray;
    attachmentsArray.removeAt(index);
  }

  getAttachmentsArray(): FormArray {
    return this.editForm.get('attachments') as FormArray;
  }

  // Category autocomplete methods
  onCategoryNameChange(value: string) {
    if (!value || value.trim() === '') {
      this.categorySuggestions = [];
      this.showCategoryDropdown = false;
      this.selectedCategory = null;
      this.editForm.patchValue({ categoryId: '' }, { emitEvent: false });
      return;
    }

    const searchTerm = value.toLowerCase().trim();
    this.categorySuggestions = this.availableCategories.filter(category =>
      category.name.toLowerCase().includes(searchTerm) ||
      category.description.toLowerCase().includes(searchTerm)
    );

    this.showCategoryDropdown = this.categorySuggestions.length > 0;
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
    this.editForm.patchValue({
      categoryId: category.id,
      categoryName: category.name
    }, { emitEvent: false });
    
    this.showCategoryDropdown = false;
    this.categorySuggestions = [];
  }

  onCategoryInputFocus() {
    if (this.editForm.get('categoryName')?.value) {
      this.onCategoryNameChange(this.editForm.get('categoryName')?.value);
    }
  }

  onCategoryInputBlur() {
    // Delay hiding dropdown to allow for click events
    setTimeout(() => {
      this.showCategoryDropdown = false;
    }, 200);
  }

  clearCategorySelection() {
    this.selectedCategory = null;
    this.editForm.patchValue({
      categoryId: '',
      categoryName: ''
    }, { emitEvent: false });
    this.showCategoryDropdown = false;
    this.categorySuggestions = [];
  }

  async loadCategories() {
    try {
      const response = await this.userService.getCategories();
      if (response && response.length > 0) {
        this.availableCategories = response;
      }
      console.log('Categories loaded:', this.availableCategories.length);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Keep using sample data if API fails
    }
  }

  async onSave() {
    if (this.editForm.valid) {
      try {
        this.isLoading = true;
        const formData = this.editForm.value;
        
        // Prepare attachments data
        const attachments: NewUserInfoAttachment[] = [];
        
        // Add existing attachments
        if (formData.attachments) {
          attachments.push(...formData.attachments);
        }
        
        // Add new file attachments
        for (let i = 0; i < this.selectedFiles.length; i++) {
          const file = this.selectedFiles[i];
          const attachment: NewUserInfoAttachment = {
            id: 0, // Will be assigned by backend
            fileName: file.name,
            fileType: file.type,
            storagePath: '', // Will be set by backend after upload
            referenceId: 0 // Will be set by backend
          };
          attachments.push(attachment);
        }
        
        if (this.isEditMode && this.rowData) {
          // Update existing user
          const updatedData: NewUserInfo = {
        ...this.rowData,
            ...formData,
            attachments: attachments
          };
          const result = await this.userService.updateNewUserInfo(updatedData);
          this.save.emit(result);
        } else {
          // Create new user
          const newData: Partial<NewUserInfo> = {
            ...formData,
            id: 0, // Will be assigned by backend
            attachments: attachments
          };
          const result = await this.userService.createNewUserInfo(newData);
          this.save.emit(result);
        }
      } catch (error) {
        console.error('Error saving user:', error);
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
      if (field.errors['min']) {
        return 'Value must be greater than or equal to 0';
      }
    }
    return '';
  }

  // Helper method to get form field value
  getFieldValue(fieldName: string): any {
    return this.editForm.get(fieldName)?.value;
  }
}
