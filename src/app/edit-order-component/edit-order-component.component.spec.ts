import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderComponentComponent } from './edit-order-component.component';

describe('EditOrderComponentComponent', () => {
  let component: EditOrderComponentComponent;
  let fixture: ComponentFixture<EditOrderComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOrderComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOrderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
