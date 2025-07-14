import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableColumnInterface } from '../../Modals/TableModals';

@Component({
  selector: 'e2v-edit-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() rowData: any = {};
  @Input() columns: TableColumnInterface[] = [];
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  editForm!: FormGroup;

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
    const formControls: { [key: string]: any } = {};
    
    this.columns.forEach(col => {
      if (col.field !== 'id' && col.isVisible !== false) {
        const fieldName = col.field || col.name;
        const validators = [];
        
        // Add required validator for important fields
        if (col.name === 'name' || col.name === 'email') {
          validators.push(Validators.required);
        }
        
        // Add email validator for email fields
        if (col.name === 'email') {
          validators.push(Validators.email);
        }
        
        formControls[fieldName] = ['', validators];
      }
    });
    
    this.editForm = this.fb.group(formControls);
  }

  populateForm() {
    if (this.editForm && this.rowData) {
      const formValues: { [key: string]: any } = {};
      
      this.columns.forEach(col => {
        if (col.field !== 'id' && col.isVisible !== false) {
          const fieldName = col.field || col.name;
          formValues[fieldName] = this.rowData[fieldName] || '';
        }
      });
      
      this.editForm.patchValue(formValues);
    }
  }

  onSave() {
    if (this.editForm.valid) {
      const updatedData = {
        ...this.rowData,
        ...this.editForm.value
      };
      this.save.emit(updatedData);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
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

  getFieldType(column: TableColumnInterface): string {
    switch (column.filterType) {
      case 'date':
        return 'date';
      case 'checkbox':
        return 'checkbox';
      case 'dropdown':
        return 'select';
      default:
        return 'text';
    }
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
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }
} 