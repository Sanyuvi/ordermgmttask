import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OrderComponent } from './order/order.component';
import { AddOrderComponentComponent } from './add-order-component/add-order-component.component';
import { EditOrderComponentComponent } from './edit-order-component/edit-order-component.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,OrderComponent,SidebarComponent,AddOrderComponentComponent,EditOrderComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ordermgmttask';
}
