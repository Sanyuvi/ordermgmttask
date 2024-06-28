import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-create-item',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './create-item.component.html',
  styleUrl: './create-item.component.css'
})
export class CreateItemComponent {
  itemForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.itemForm = this.fb.group({
      itemName: [''],
      category: [''],
      price: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.itemForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('itemName', this.itemForm.get('itemName')?.value);
      formData.append('category', this.itemForm.get('category')?.value);
      formData.append('price', this.itemForm.get('price')?.value);
      formData.append('image', this.selectedFile);

      this.http.post('http://localhost:8087/api/items/createitem', formData).pipe(
        tap((response) => {
          console.log('Item saved successfully', response);
          alert('Item added successfully');
          this.itemForm.reset();
          this.previewUrl = null;
          // this.router.navigate(['/items']);
        }),
        catchError((error) => {
          console.error('Error saving item', error);
          return of(null);  // Handle error and return a safe value
        })
      ).subscribe();
    }
  }

  onCancel(): void {
    this.itemForm.reset();
    this.previewUrl = null;
     this.router.navigate(['/items']);
  }
}
