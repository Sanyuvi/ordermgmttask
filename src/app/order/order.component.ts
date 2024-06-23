import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 





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
  constructor(private http:HttpClient) {
    
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
 

}
class Orders {
  orderId!: number;
  orderDate!: string;
  customerName!: string;
  amount!: number;
}