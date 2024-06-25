import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  [key: string]: string | number | undefined;
}
@Component({
  selector: 'app-edit-order-component',
  standalone: true,
  imports: [SidebarComponent,FormsModule,CommonModule,MatButtonModule,MatIconModule],
  templateUrl:'./edit-order-component.component.html',
  styleUrl: './edit-order-component.component.css'
})
export class EditOrderComponentComponent implements OnInit{
  orderId: string = '';
  orderDate: string = '';
  customerName: string = '';
  items: OrderItem[] = [];
  totalAmount: number = 0;
data:any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchOrder(this.orderId);
  }

  fetchOrder(orderId: string): void {
    this.http.get<Order>(`https://ordermgbackend.onrender.com/api/orders/${orderId}`).subscribe({
      next: (order) => {
        this.data = order;
        // this.orderId = order.orderId;
        if (order.orderDate instanceof Date) {
          this.orderDate = order.orderDate.toISOString().substring(0, 10);
      } else if (typeof order.orderDate === 'string') {
          // If orderDate is a string, parse it as a Date
          this.orderDate = new Date(order.orderDate).toISOString().substring(0, 10);
      } else {
          // Handle other cases if necessary
          console.warn('Unexpected orderDate format:', order.orderDate);
          this.orderDate = ''; // Or set a default value
      }
        this.customerName = order.customerName;
        this.items = order.items;
         this.calculateTotalAmount();
      },
      error: (error) => {
        console.error('Error fetching order:', error);
      }
    });
  }

  addItem(): void {
    if (this.items.length < 5) {
      this.items.push({ itemName: ' ', unitPrice: 0, quantity: 0, amount:0 });
    } else {
      alert('Cannot add more than 5 items.');
    }
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
    this.calculateTotalAmount();
  }

  handleInputChange(index: number, property: keyof OrderItem, event: Event): void{
    const target = event.target as HTMLInputElement;
    const value = target.value;
    if (property === 'unitPrice' || property === 'quantity') {
      this.items[index][property] = parseFloat(value as string);
    } else {
      this.items[index][property] = value;
    }
    this.calculateAmount(this.items[index]);
  }

  calculateAmount(item: OrderItem): void {
    item.amount = item.unitPrice * item.quantity;
    this.calculateTotalAmount();
  }

  calculateTotalAmount():number{
    return this.totalAmount = this.items.reduce((total, item) => total + (item.amount || 0), 0);
  }

  saveOrder(): void {
    const updatedOrder: Order = {
      orderId: this.orderId,
      orderDate: new Date(this.orderDate),
      customerName: this.customerName,
      items: this.items
    };

    for (let item of this.items) {
      if (!item.itemName || !item.unitPrice || !item.quantity) {
        alert('Please fill in all item details.');
        return;
      }
    }

    this.http.put(`https://ordermgbackend.onrender.com/api/orders/editorder/${this.orderId}`, updatedOrder).subscribe({
      next: (res:any) => {
        console.log(res);

        alert('Order updated successfully');
        this.router.navigate(['/']);
      },
      error: (error:any) => {
        console.error('Error updating order:', error);
        console.error('updatedOrder:', updatedOrder);
        alert('Failed to update order');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}

