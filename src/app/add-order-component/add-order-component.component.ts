import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Item {
  _id: string;
  itemName: string;
  price: number;
}

interface Order {
  orderId: string;
  orderDate: Date;
  customerName: string;
  items: OrderItem[];
}

interface OrderItem {
  itemName: string;
  unitPrice: number;
  quantity: number;
  amount?: number;
}
@Component({
  selector: 'app-add-order-component',
  standalone: true,
  imports: [SidebarComponent,FormsModule,CommonModule,MatButtonModule,
    MatIconModule],
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
  
  orders: Order[] = [];
  baseUrl: string = 'https://ordermgbackend.onrender.com'; // Base URL for the backend
   constructor(private http: HttpClient, private router: Router) { }

   ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems(): void {
    this.http.get<Item[]>(`${this.baseUrl}/api/items`).subscribe({
      next: (response) => {
        this.items = response;
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    });
  }

  addItem(event: Event, itemId: string): void {
    event.preventDefault();
  if (this.newOrder.items.length < 5) {
    const selectedItem = this.items.find(item => item._id === itemId);

    if (selectedItem) {
      const existingItem = this.newOrder.items.find(item => item.itemName === selectedItem.itemName);

      if (existingItem) {
        existingItem.quantity += 1;
        this.calculateAmount(existingItem);
      } else {
          const newOrderItem: OrderItem = {
            itemName: selectedItem.itemName,
            unitPrice: selectedItem.price,
            quantity: 1
          };
          this.newOrder.items.push(newOrderItem);
          this.calculateAmount(newOrderItem);
        }
      }
    } else {
      alert('Cannot add more than 5 items.');
    }
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

    this.http.post<{ message: string, order: Order }>(`${this.baseUrl}/api/orders/neworder`, this.newOrder)
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

