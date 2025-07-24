import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
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

  // Remove all category autocomplete and categoryName logic
  // Only keep categoryId in the form
  // Remove categorySelectionValidator and related fields/methods

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
      isActive: [true],
      totalItems: [0],
      attachments: this.fb.array([])
    });
  }

  populateForm() {
    const currentRowData = this.rowData;
    if (this.editForm && currentRowData) {
      this.deletedAttachmentIds = [];
      this.editForm.patchValue({
        title: currentRowData.title || '',
        description: currentRowData.description || '',
        categoryId: currentRowData.categoryId || '',
        subcategoryId: currentRowData.subcategoryId || null,
        isActive: currentRowData.isActive ?? true,
        totalItems: currentRowData.totalItems || 0
      });
      // No selectedCategory or categoryName logic needed
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
  // Remove all category autocomplete and categoryName logic
  // Only keep categoryId in the form
  // Remove categorySelectionValidator and related fields/methods

  // Remove all category autocomplete and categoryName logic
  // Only keep categoryId in the form
  // Remove categorySelectionValidator and related fields/methods

  async loadCategories() {
    try {
      this.isLoadingCategories = true;
      const response = await this.userService.getCategories();
      debugger
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
    if (this.editForm.valid) {
      try {
        this.isLoading = true;
        const formData = this.editForm.value;
        const combinedAttachments = [...this.selectedFiles];
        if (formData.attachments && formData.attachments.length > 0) {
          formData.attachments.forEach((attachment: any) => {
            if (!this.deletedAttachmentIds.includes(attachment.id)) {
              combinedAttachments.push(attachment);
            }
          });
        }
        if (this.isEditMode && this.rowData) {
          const updatePayload = {
            newUserInfoId: this.rowData.id,
            title: formData.title,
            description: formData.description,
            categoryId: formData.categoryId,
            isActive: formData.isActive,
            attachments: combinedAttachments,
            deletedAttachmentIds: this.deletedAttachmentIds
          };
          const result = await this.userService.updateNewUserInfoWithRequest(updatePayload);
          this.save.emit(result);
        } else {
          const createPayload: CreateNewUserInfoRequestDto = {
            title: formData.title,
            description: formData.description,
            categoryId: formData.categoryId,
            subcategoryId: formData.subcategoryId || undefined,
            isActive: formData.isActive,
            attachments: combinedAttachments
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
    // No selectedCategory or categoryName logic needed
    this.availableCategories = [];
    this.isLoadingCategories = false;

    // Reset form if it exists
    if (this.editForm) {
      this.editForm.reset({
        title: '',
        description: '',
        categoryId: '',
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

  // Custom validator to ensure categoryName and categoryId are consistent
  // Remove all category autocomplete and categoryName logic
  // Only keep categoryId in the form
  // Remove categorySelectionValidator and related fields/methods

}
