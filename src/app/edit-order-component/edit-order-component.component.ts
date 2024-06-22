import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-edit-order-component',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './edit-order-component.component.html',
  styleUrl: './edit-order-component.component.css'
})
export class EditOrderComponentComponent {

}
