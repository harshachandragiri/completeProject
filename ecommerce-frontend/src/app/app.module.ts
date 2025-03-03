import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './auth/auth-routing.module'; // ✅ Ensure this import exists
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProfileComponent } from '../app/components/profile/profile.component';
import { UserOrdersComponent } from './pages/user-orders/user-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AdminDashboardComponent,
    ProductListComponent,
    CartComponent,
    CheckoutComponent,
    ProfileComponent,
    UserOrdersComponent
   
  ],
  imports: [
    BrowserModule,HttpClientModule,RouterModule,AppRoutingModule,FormsModule,AuthModule,NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
