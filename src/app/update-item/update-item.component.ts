import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-update-item',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './update-item.component.html',
  styleUrl: './update-item.component.css'
})
export class UpdateItemComponent implements OnInit {

  itemForm: FormGroup;
  itemId!: string;
  item: any;
  imagePreview!: string ;
  baseUrl: string = 'https://ordermgbackend.onrender.com'; // Base URL for the backend

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      itemName: [''],
      category: [''],
      price: [''],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id')!;
    this.loadItem();
  }

  loadItem(): void {
    this.http.get<any>(`${this.baseUrl}/api/items/${this.itemId}`).subscribe({
      next : (data) => {
        this.item = data;
        this.itemForm.patchValue({
          itemName: data.itemName,
          category: data.category,
          price: data.price
        });
        // Construct the full image URL
        this.imagePreview = `${this.baseUrl}/Images/${data.image}`;
      },
      error : (error) => console.error('Error loading item', error)
  });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    this.itemForm.patchValue({ image: file });
    this.itemForm.get('image')!.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('itemName', this.itemForm.get('itemName')!.value);
    formData.append('category', this.itemForm.get('category')!.value);
    formData.append('price', this.itemForm.get('price')!.value);
    if (this.itemForm.get('image')!.value) {
      formData.append('image', this.itemForm.get('image')!.value);
    }

    this.http.put(`${this.baseUrl}/api/items/edititem/${this.itemId}`, formData).subscribe({
      next: (response) => {
        console.log('Item updated successfully', response);
        alert('Item updated successfully');
        this.router.navigate(['/items']);
      },
      error: (error) => {
        console.error('Error updating item', error);
      }
    }
    );
  }

  clickCancel(){
  this.router.navigate(['/items'])
  }
}


