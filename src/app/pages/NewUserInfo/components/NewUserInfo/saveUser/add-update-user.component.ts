import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewUserInfo, UpdateNewUserInfoRequestDto, CreateNewUserInfoRequestDto } from '../../../Modals/NewUserInfoModals';
import { UserService } from '../../../service/userService';

@Component({
  selector: 'e2v-add-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-update-user.component.html',
  styleUrls: ['./add-update-user.component.css']
})
export class AddUpdateUserComponent implements OnInit, OnChanges, OnDestroy {
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
  deletedAttachmentIds: number[] = []; // Track deleted attachment IDs

  // Category autocomplete properties
  categorySuggestions: any[] = [];
  showCategoryDropdown = false;
  selectedCategory: any = null;

  // Categories will be loaded from database
  availableCategories: any[] = [];
  isLoadingCategories = false;
  private fb= inject(FormBuilder);
  private userService=inject(UserService);
  constructor(
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCategories();
    // If rowData is already available, populate the form
    if (this.rowData && this.editForm) {
      this.populateForm();
    }
  }

  ngOnDestroy() {
    // Clean up any subscriptions if needed
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rowData'] && this.rowData) {
      // If form is already created, populate it immediately
      if (this.editForm) {
        this.populateForm();
      }
      // If form is not created yet, it will be populated in ngOnInit
    }
  }

  createForm() {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', [Validators.required]],
      categoryName: [''],
      subcategoryId: [null],
      isActive: [true],
      totalItems: [0],
      attachments: this.fb.array([])
    });

    // Add listener for category name changes (for UI purposes only)
    this.editForm.get('categoryName')?.valueChanges.subscribe(value => {
      this.onCategoryNameChange(value);
    });
  }

  populateForm() {
    const currentRowData = this.rowData;
    if (this.editForm && currentRowData) {
      // Reset deleted attachment IDs for new edit session
      this.deletedAttachmentIds = [];

      this.editForm.patchValue({
        title: currentRowData.title || '',
        description: currentRowData.description || '',
        categoryId: currentRowData.categoryId || '',
        subcategoryId: currentRowData.subcategoryId || null,
        categoryName: currentRowData.categoryName || '',
        isActive: currentRowData.isActive ?? true,
        totalItems: currentRowData.totalItems || 0
      });

      // Set selected category if editing
      if (currentRowData.categoryId && currentRowData.categoryName) {
        this.selectedCategory = {
          id: currentRowData.categoryId,
          name: currentRowData.categoryName
        };
      }

      // Populate attachments if they exist
      if (currentRowData.attachments && currentRowData.attachments.length > 0) {
        this.populateAttachments();
      }
    }
  }

  populateAttachments() {
    const currentRowData = this.rowData;
    if (currentRowData?.attachments) {
      const attachmentsArray = this.editForm.get('attachments') as FormArray;
      attachmentsArray.clear();

      currentRowData.attachments.forEach(attachment => {
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
    const attachmentToRemove = attachmentsArray.at(index).value;
    if (attachmentToRemove.id && attachmentToRemove.id > 0) {
      this.deletedAttachmentIds.push(attachmentToRemove.id);
    }

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
      category.name.toLowerCase().includes(searchTerm)
    );

    this.showCategoryDropdown = this.categorySuggestions.length > 0;

    // If no exact match found, clear the categoryId to prevent invalid selection
    const exactMatch = this.availableCategories.find(category =>
      category.name.toLowerCase() === searchTerm
    );

    if (!exactMatch) {
      this.editForm.patchValue({ categoryId: '' }, { emitEvent: false });
      this.selectedCategory = null;
    }
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
      this.isLoadingCategories = true;
      const response = await this.userService.getCategories();
      if (response && response.length > 0) {
        this.availableCategories = response;
      } else {
        this.availableCategories = [];
      }
    } catch (error) {
      // Initialize with empty array if API fails
      this.availableCategories = [];
      alert('Failed to load categories. Please try again.');
    } finally {
      this.isLoadingCategories = false;
    }
  }

  async onSave() {
    // Additional validation: ensure category is selected from existing categories
    const categoryName = this.editForm.get('categoryName')?.value;
    const categoryId = this.editForm.get('categoryId')?.value;

    if (categoryName && !categoryId) {
      alert('Please select a valid category from the dropdown. You cannot add new categories.');
      return;
    }

    if (this.editForm.valid) {
      try {
        this.isLoading = true;
        const formData = this.editForm.value;

        // Combine selectedFiles and existing attachments from form
        const combinedAttachments = [...this.selectedFiles];

        // Add existing attachments that haven't been deleted
        if (formData.attachments && formData.attachments.length > 0) {
          formData.attachments.forEach((attachment: any) => {
            // Only include attachments that haven't been marked for deletion
            if (!this.deletedAttachmentIds.includes(attachment.id)) {
              combinedAttachments.push(attachment);
            }
          });
        }

        if (this.isEditMode && this.rowData) {
          // Update existing user - match UpdateNewUserInfoRequestDto structure
          const updatePayload = {
            newUserInfoId: this.rowData.id,
            title: formData.title,
            description: formData.description,
            categoryId: formData.categoryId,
            isActive: formData.isActive,
            attachments: combinedAttachments, // Combined files and existing attachments
            deletedAttachmentIds: this.deletedAttachmentIds // IDs of deleted attachments
          };
          const result = await this.userService.updateNewUserInfoWithRequest(updatePayload);
          this.save.emit(result);
        } else {
          // Create new user - use CreateNewUserInfoRequestDto structure
          const createPayload: CreateNewUserInfoRequestDto = {
            title: formData.title,
            description: formData.description,
            categoryId: formData.categoryId,
            subcategoryId: formData.subcategoryId || undefined,
            isActive: formData.isActive,
            attachments: combinedAttachments // Combined files and existing attachments
          };
          const result = await this.userService.createNewUserInfoWithRequest(createPayload);
          this.save.emit(result);
        }
      } catch (error) {
        // Handle error appropriately
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.resetFormState();
    this.cancel.emit();
    this.close.emit();
  }

  onClose() {
    this.resetFormState();
    this.close.emit();
  }

  private resetFormState() {
    this.selectedFiles = [];
    this.previewUrls = [];
    this.deletedAttachmentIds = [];
    this.selectedCategory = null;
    this.categorySuggestions = [];
    this.showCategoryDropdown = false;

    // Reset form if it exists
    if (this.editForm) {
      this.editForm.reset({
        title: '',
        description: '',
        categoryId: '',
        categoryName: '',
        subcategoryId: null,
        isActive: true,
        totalItems: 0,
        attachments: this.fb.array([])
      });
    }
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
