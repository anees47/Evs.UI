import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewComponent } from '../../../../shared/components/tree-view/tree-view.component';
import { TreeDataDto } from '../../../../shared/Modals/TreeViewModels';

interface GroceryItem {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  price?: number;
  isAvailable: boolean;
  description?: string;
}

interface GroceryCategory {
  id: number;
  name: string;
  icon: string;
  subcategories?: GrocerySubcategory[];
  items?: GroceryItem[];
}

interface GrocerySubcategory {
  id: number;
  name: string;
  categoryId: number;
  items?: GroceryItem[];
}

@Component({
  selector: 'app-grocery-catalog',
  standalone: true,
  imports: [CommonModule, TreeViewComponent],
  templateUrl: './grocery-catalog.component.html',
  styleUrls: ['./grocery-catalog.component.css']
})
export class GroceryCatalogComponent implements OnInit {

  treeData!: TreeDataDto<GroceryCategory>;
  selectedItems: any[] = [];

  ngOnInit(): void {
    this.initializeGroceryData();
  }

  private initializeGroceryData(): void {
    // Sample grocery data
    const groceryCategories: GroceryCategory[] = [
      {
        id: 1,
        name: 'Fruits & Vegetables',
        icon: 'pi pi-apple',
        subcategories: [
          {
            id: 11,
            name: 'Fresh Fruits',
            categoryId: 1,
            items: [
              { id: 111, name: 'Apples', category: 'Fresh Fruits', price: 2.99, isAvailable: true, description: 'Red delicious apples' },
              { id: 112, name: 'Bananas', category: 'Fresh Fruits', price: 1.49, isAvailable: true, description: 'Fresh bananas' },
              { id: 113, name: 'Oranges', category: 'Fresh Fruits', price: 3.99, isAvailable: false, description: 'Navel oranges' }
            ]
          },
          {
            id: 12,
            name: 'Vegetables',
            categoryId: 1,
            items: [
              { id: 121, name: 'Carrots', category: 'Vegetables', price: 1.99, isAvailable: true, description: 'Organic carrots' },
              { id: 122, name: 'Broccoli', category: 'Vegetables', price: 2.49, isAvailable: true, description: 'Fresh broccoli heads' },
              { id: 123, name: 'Spinach', category: 'Vegetables', price: 2.99, isAvailable: true, description: 'Baby spinach leaves' }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Dairy & Eggs',
        icon: 'pi pi-heart',
        subcategories: [
          {
            id: 21,
            name: 'Milk Products',
            categoryId: 2,
            items: [
              { id: 211, name: 'Whole Milk', category: 'Milk Products', price: 3.49, isAvailable: true, description: '1 gallon whole milk' },
              { id: 212, name: 'Greek Yogurt', category: 'Milk Products', price: 4.99, isAvailable: true, description: 'Plain Greek yogurt' }
            ]
          },
          {
            id: 22,
            name: 'Cheese',
            categoryId: 2,
            items: [
              { id: 221, name: 'Cheddar Cheese', category: 'Cheese', price: 5.99, isAvailable: true, description: 'Sharp cheddar block' },
              { id: 222, name: 'Mozzarella', category: 'Cheese', price: 4.49, isAvailable: false, description: 'Fresh mozzarella ball' }
            ]
          }
        ]
      },
      {
        id: 3,
        name: 'Bakery',
        icon: 'pi pi-sun',
        subcategories: [
          {
            id: 31,
            name: 'Bread',
            categoryId: 3,
            items: [
              { id: 311, name: 'White Bread', category: 'Bread', price: 2.49, isAvailable: true, description: 'Sliced white bread' },
              { id: 312, name: 'Whole Wheat', category: 'Bread', price: 2.99, isAvailable: true, description: 'Whole wheat bread' }
            ]
          },
          {
            id: 32,
            name: 'Pastries',
            categoryId: 3,
            items: [
              { id: 321, name: 'Croissants', category: 'Pastries', price: 3.99, isAvailable: true, description: 'Butter croissants' },
              { id: 322, name: 'Muffins', category: 'Pastries', price: 2.99, isAvailable: true, description: 'Blueberry muffins' }
            ]
          }
        ]
      }
    ];

    // Configure tree data structure
    this.treeData = {
      nodes: groceryCategories,
      parentKey: 'id',
      nodesOptions: {
        title: 'name',
        icon: 'icon',
        description: 'Grocery categories',
        childrenField: 'subcategories'
      },
      firstLevelChildOptions: {
        title: 'name',
        icon: 'pi pi-folder',
        description: 'Subcategories',
        childrenField: 'items'
      },
      secondLevelChildOptions: {
        title: 'name',
        icon: 'pi pi-shopping-cart',
        description: 'Items',
        useFieldNameAsData: true
      }
    };
  }

  onItemSelected(event: any): void {
    console.log('Selected item:', event);
    this.selectedItems.push(event);
  }

  clearSelection(): void {
    this.selectedItems = [];
  }
}
