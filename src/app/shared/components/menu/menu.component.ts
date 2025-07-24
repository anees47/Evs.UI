import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'e2v-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  showUserDropdown = false;
  showGrosseryDropdown = false;

  constructor(private router: Router) {}

  onCellActionClick(){

  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
    // Close other dropdowns
    this.showGrosseryDropdown = false;
  }

  toggleGrosseryDropdown() {
    this.showGrosseryDropdown = !this.showGrosseryDropdown;
    // Close other dropdowns
    this.showUserDropdown = false;
  }

  goToUser() {
    this.router.navigate(['/user/users']);
    this.showUserDropdown = false;
  }
    goToUserUsersInfo() {
    this.router.navigate(['/user/usersInfo']);
    this.showUserDropdown = false;
  }

  goToNewUserInfoCategories() {
    this.router.navigate(['/user/categories']);
    this.showUserDropdown = false;
  }

  goToFaq() {
    // Placeholder for FAQ navigation
    alert('FAQ clicked!');
  }

  goToGrossery(option: string) {
    alert('Grossery option: ' + option);
    this.showGrosseryDropdown = false;
  }
}
