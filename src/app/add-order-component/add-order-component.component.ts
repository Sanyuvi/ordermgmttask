import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Item {
  _id: string;
  itemName: string;
  price: number;
  thumbnail: string ;
}

interface Order {
  orderId: string;
  orderDate: Date;
  customerName: string;
  items: OrderItem[];
}

interface OrderItem {
  thumbnail: string | "" ;
  itemName: string;
  unitPrice: number;
  quantity: number;
  amount?: number;
}
@Component({
  selector: 'app-add-order-component',
  standalone: true,
  imports: [SidebarComponent,FormsModule,CommonModule,MatButtonModule,
    MatIconModule,MatAutocompleteModule,ReactiveFormsModule,MatLabel,MatFormFieldModule,MatInputModule],
  templateUrl: './add-order-component.component.html',
  styleUrl: './add-order-component.component.css'
})
export class AddOrderComponentComponent implements OnInit {
   newOrder: Order = {
     orderId: '',
     orderDate: new Date(),
     customerName: '',
     items: []
  };

  items: Item[] = [];
  selectedItems: Item[] = [];
  itemControl = new FormControl();
  filteredItems!: Observable<Item[]>;
  orders: Order[] = [];
  baseUrl: string = 'http://localhost:8087'; // Base URL for the backend
   constructor(private http: HttpClient, private router: Router) { }
   ngOnInit(): void {
    this.fetchItems();

    this.filteredItems = this.itemControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? this._filter(value) : this.items.slice())
    );
  }

  fetchItems(): void {
    this.http.get<Item[]>(`${this.baseUrl}/api/items`).subscribe({
      next: (response) => {
        console.log(response);
        this.items = response;
        this.itemControl.setValue('');
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    });
  }

  private _filter(value: string): Item[] {
    const filterValue = value.toLowerCase();
    return this.items.filter(item => item.itemName.toLowerCase().includes(filterValue));
  }

  displayItem(item: Item): string {
    return item && item.itemName ? item.itemName : '';
  }

  onItemSelected(event: any): void {
    const selectedItem: Item = event.option.value;
    const existingItem = this.newOrder.items.find(item => item.itemName === selectedItem.itemName);

    if (existingItem) {
      existingItem.quantity += 1;
      this.calculateAmount(existingItem);
    } else {
      const newOrderItem: OrderItem = {
        itemName: selectedItem.itemName,
        unitPrice: selectedItem.price,
        quantity: 1,
        thumbnail: selectedItem.thumbnail
      };
      this.newOrder.items.push(newOrderItem);
      this.calculateAmount(newOrderItem);
    }

    this.itemControl.setValue('');
  }

  getThumbnailUrl(thumbnail: string): string {
    return `${this.baseUrl}/Images/${thumbnail}`;
  }

   removeItem(index: number): void {
     this.newOrder.items.splice(index, 1);
   }

   calculateAmount(item: OrderItem): void {
     item.amount = item.unitPrice * item.quantity;
   }

   calculateTotalAmount(): number {
     return this.newOrder.items.reduce((total, item) => total + (item.amount || 0), 0);
   }

   saveOrder(): void {
    // Ensure no items have empty required fields before saving
    for (let item of this.newOrder.items) {
      if (!item.itemName || !item.unitPrice || !item.quantity) {
        alert('Please fill in all item details.');
        return;
      }
    }

    this.http.post<{ message: string, order: Order }>(`https://ordermgbackend.onrender.com/api/orders/neworder`, this.newOrder)
      .subscribe({
        next: (response) => {
          alert('New order added successfully');
          this.orders.push(response.order);
          this.router.navigate(['']);
        },
        error: (error) => {
          console.error('Error adding order:', error);
          alert('Failed to add new order');
        }
      });
  }

   cancel(): void {
     this.router.navigate(['/']);
   }

}

