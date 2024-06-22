import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderComponentComponent } from './add-order-component.component';

describe('AddOrderComponentComponent', () => {
  let component: AddOrderComponentComponent;
  let fixture: ComponentFixture<AddOrderComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrderComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
