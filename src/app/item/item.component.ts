import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [SidebarComponent,CommonModule,MatButtonModule,
    MatIconModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  items: Items [] = [
    {
    itemName:"Mouse",
    category:"Electronics",
    price:450,
    image:"Mouse img"
  },{
    itemName:"Mouse",
    category:"Electronics",
    price:450,
    image:"Mouse img"

  }];
  constructor(private http:HttpClient,private router: Router) {

  }

  clickEditItem(){
    this.router.navigate(['/updateitem']);
  }

  deleteItem(){

  }

  clickCreate(){
    this.router.navigate(['/createitem']);
  }
}

class Items {
  itemName! : string
  category!: string;
  price!: number;
  image!: string;
}
