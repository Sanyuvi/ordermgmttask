import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  thumbnail: string;
}

interface Order {
  orderId: string;
  orderDate: Date;
  customerName: string;
  items: OrderItem[];
}

interface OrderItem {
  thumbnail: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  amount?: number;
  [key: string]: string | number | undefined;
}

@Component({
  selector: 'app-edit-order-component',
  standalone: true,
  imports: [SidebarComponent,FormsModule,CommonModule,MatButtonModule,MatIconModule,MatAutocompleteModule,ReactiveFormsModule,MatLabel,MatFormFieldModule,MatInputModule],
  templateUrl:'./edit-order-component.component.html',
  styleUrl: './edit-order-component.component.css'
})
export class EditOrderComponentComponent implements OnInit {
  orderId: string = '';
  orderDate: string = '';
  customerName: string = '';
  items: OrderItem[] = [];
  totalAmount: number = 0;
  data: any ;
  availableItems: Item[] = [];
  baseUrl: string = 'http://localhost:8087'; // Base URL for the backend
  itemControl = new FormControl();
  filteredItems!: Observable<Item[]>;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchOrder(this.orderId);
    this.fetchItems();

    this.filteredItems = this.itemControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? this._filter(value) : this.availableItems.slice())
    );
  }

  fetchOrder(orderId: string): void {
    this.http.get<Order>(`https://ordermgbackend.onrender.com/api/orders/${orderId}`).subscribe({
      next: (order) => {
        this.data = order;
        if (order.orderDate instanceof Date) {
          this.orderDate = order.orderDate.toISOString().substring(0, 10);
        } else if (typeof order.orderDate === 'string') {
          this.orderDate = new Date(order.orderDate).toISOString().substring(0, 10);
        } else {
          console.warn('Unexpected orderDate format:', order.orderDate);
          this.orderDate = '';
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

  fetchItems(): void {
    this.http.get<Item[]>(`${this.baseUrl}/api/items`).subscribe({
      next: (response) => {
        this.availableItems = response;
        this.itemControl.setValue('');
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    });
  }

  private _filter(value: string): Item[] {
    const filterValue = value.toLowerCase();
    return this.availableItems.filter(item => item.itemName.toLowerCase().includes(filterValue));
  }

  displayItem(item: Item): string {
    return item && item.itemName ? item.itemName : '';
  }

  onItemSelected(event: any): void {
    const selectedItem: Item = event.option.value;
    const existingItem = this.items.find(item => item.itemName === selectedItem.itemName);

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
      this.items.push(newOrderItem);
      this.calculateAmount(newOrderItem);
    }

    this.itemControl.setValue('');
  }

  getThumbnailUrl(thumbnail: string): string {
    return `${this.baseUrl}/Images/${thumbnail}`;
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
    this.calculateTotalAmount();
  }

  handleInputChange(index: number, property: keyof OrderItem, event: Event): void {
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

  calculateTotalAmount(): number {
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
      next: (res: any) => {
        console.log(res);

        alert('Order updated successfully');
        this.router.navigate(['/']);
      },
      error: (error: any) => {
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

