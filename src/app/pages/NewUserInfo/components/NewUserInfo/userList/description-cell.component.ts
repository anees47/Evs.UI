import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'e2v-description-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="description-cell">
      <div class="description-text" [class.truncated]="isLongDescription">
        {{ description }}
      </div>
      @if (isLongDescription) {
        <button 
          type="button" 
          class="btn btn-sm btn-outline-primary view-more-btn"
          (click)="showFullDescription()"
          title="View full description"
        >
          <i class="bi bi-eye"></i>
        </button>
      }
    </div>
  `,
  styles: [`
    .description-cell {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      width: 100%;
    }

    .description-text {
      flex: 1;
      word-wrap: break-word;
      line-height: 1.4;
    }

    .description-text.truncated {
      max-height: 3.2em; /* 2 lines of text */
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .view-more-btn {
      flex-shrink: 0;
      padding: 2px 6px;
      font-size: 12px;
      min-width: auto;
      height: 24px;
    }

    .view-more-btn i {
      font-size: 10px;
    }
  `]
})
export class DescriptionCellComponent {
  @Input() description: string = '';
  @Input() maxLength: number = 50; // Default max length

  get isLongDescription(): boolean {
    return !!(this.description && this.description.length > this.maxLength);
  }

  showFullDescription() {
    // Create and show a modal/popup with the full description
    const modal = document.createElement('div');
    modal.className = 'description-modal-backdrop';
    modal.innerHTML = `
      <div class="description-modal">
        <div class="description-modal-header">
          <h5>Full Description</h5>
          <button type="button" class="btn-close" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="description-modal-body">
          <p>${this.description}</p>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .description-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1050;
      }

      .description-modal {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
      }

      .description-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #dee2e6;
        background-color: #f8f9fa;
      }

      .description-modal-header h5 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .description-modal-header .btn-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .description-modal-header .btn-close:hover {
        background-color: #e9ecef;
      }

      .description-modal-body {
        padding: 20px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .description-modal-body p {
        margin: 0;
        line-height: 1.6;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Handle close button click
    const closeBtn = modal.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
      });
    }

    // Handle backdrop click
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        document.body.removeChild(modal);
        document.head.removeChild(style);
      }
    });

    // Handle escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        document.body.removeChild(modal);
        document.head.removeChild(style);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }
} 