import { Component, OnInit } from '@angular/core';
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
export class ItemComponent implements OnInit {
  items: Items[] = [];
  baseUrl: string = 'https://ordermgbackend.onrender.com'; // Base URL for the backend
  constructor(private http:HttpClient,private router: Router) {

  }

  ngOnInit() {
    this.getItems().subscribe((response) => {
      this.items = response;
      console.log(response);
    })
  }

  getThumbnailUrl(thumbnail: string): string {
    return `${this.baseUrl}/Images/${thumbnail}`;
  }

  clickEditItem(id: String): void{
    this.router.navigate([`/updateitem/${id}`]);
  }

  getItems(){
return this.http.get<Items[]>(`${this.baseUrl}/api/items`)
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.http.delete(`${this.baseUrl}/api/items/deleteitem/${id}`).subscribe({
        next: (response) => {
          this.items = this.items.filter((item) => item._id !== id);
          alert('Item deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting item', error);
          alert('Error deleting item: ' + error.message);
        }
      }
      );
    }
  }


  clickCreate(){

    this.router.navigate(['/createitem']);
  }
}

class Items {
  _id! : string
  itemName! : string
  category!: string;
  price!: number;
  image: string | ArrayBuffer | null = null;
  thumbnail!: string ;
}
