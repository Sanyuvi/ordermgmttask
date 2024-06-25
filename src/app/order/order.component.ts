import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [SidebarComponent,CommonModule,MatButtonModule,
    MatIconModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  orders: Orders[] = [];
  constructor(private http:HttpClient,private router: Router) {

  }

  ngOnInit() {
    this.getOrders().subscribe((response) => {
      this.orders = response;
      console.log(response);
    })
  }

  getOrders() {
    return this.http.get<Orders[]>('https://ordermgbackend.onrender.com/api/orders')
  }

  deleteOrders(orderId: string): void {
     this.http.delete(`https://ordermgbackend.onrender.com/api/orders/deleteorder/${orderId}`).subscribe(
      ()=>{
        this.orders = this.orders.filter((order) => order._id !== orderId);
        alert("order deleted successfully")
      })

  }

  handleClick(){
    this.router.navigate(['/neworder']);
  }

  editOrder(orderId: string): void {
    this.router.navigate([`/editorder/${orderId}`]);
  }
}
class Orders {
  _id! : string
  orderId!: string;
  orderDate!: string;
  customerName!: string;
  amount!: number;
  items!: OrderItem[];
  totalAmount?: number;
}

class OrderItem {
  itemName!: string;
  unitPrice!: number;
  quantity!: number;
  amount?: number; }
