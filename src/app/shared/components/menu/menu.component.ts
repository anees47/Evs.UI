import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'e2v-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  showDropdown = false;

  constructor(private router: Router) {}
  onCellActionClick(){

  }
  goToUser() {
    this.router.navigate(['/user/users']);
  }

  goToFaq() {
    // Placeholder for FAQ navigation
    alert('FAQ clicked!');
  }

  goToGrossery(option: string) {
    alert('Grossery option: ' + option);
  }
}
