import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-add-order-component',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './add-order-component.component.html',
  styleUrl: './add-order-component.component.css'
})
export class AddOrderComponentComponent {

}
