import { Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { AddOrderComponentComponent } from './add-order-component/add-order-component.component';
import { EditOrderComponentComponent } from './edit-order-component/edit-order-component.component';
import { ItemComponent } from './item/item.component';

export const routes: Routes = [
    { path: '', component: OrderComponent },
    { path: 'neworder', component: AddOrderComponentComponent },
    { path: 'editorder/:id', component: EditOrderComponentComponent },
    { path: 'items', component: ItemComponent },
];
