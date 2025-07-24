import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { FileExportService } from '../../services/file-export.service';

@Component({
  selector: 'file-export',
  standalone: true,
  imports: [ButtonModule, AccordionModule,ProgressSpinnerModule],
  templateUrl: './file-export.component.html',
  styleUrl: './file-export.component.css'
})
export class FileExportComponent {
  exportService = inject(FileExportService)

  exportFiles = toSignal(this.exportService.exportFiles$);
  file = toSignal(this.exportService.exportFile$);
  autoClose = false;

  closeFileExporter(){
    this.exportService.close()
  }

}
