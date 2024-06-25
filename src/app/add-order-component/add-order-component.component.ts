import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



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
export class AddOrderComponentComponent {
   newOrder: Order = {
     orderId: '',
     orderDate: new Date(),
     customerName: '',
     items: []
   };

   orders: Order[] = [];
   constructor(private http: HttpClient, private router: Router) { }

   addItem(): void {
    if (this.newOrder.items.length < 5) {
      this.newOrder.items.push({ itemName: '', unitPrice: 0, quantity: 0 });
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

