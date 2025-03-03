// import { Controller, Post, Body, Get, Param } from '@nestjs/common';
// import { OrdersService } from './orders.service';
// import { Order } from './orders.entity';

// @Controller('orders')
// export class OrdersController {
//   constructor(private readonly ordersService: OrdersService) {}

//   @Post()
//   async placeOrder(@Body() orderData: Partial<Order>): Promise<Order> {
//     return this.ordersService.createOrder(orderData);
//   }

//   @Get(':userId')
//   async getOrders(@Param('userId') userId: string): Promise<Order[]> {
//     return this.ordersService.getOrdersByUser(userId);
//   }
// }
import { Controller, Post, Body, Get, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './orders.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async placeOrder(@Body() orderData: Partial<Order>): Promise<Order> {
    if (!orderData.userId) {
      throw new BadRequestException('User ID is required to place an order.');
    }
    return this.ordersService.createOrder(orderData);
  }

  @Get(':userId')
  async getOrders(@Param('userId') userId: string): Promise<Order[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }

    const orders = await this.ordersService.getOrdersByUser(userId);
    if (!orders || orders.length === 0) {
      throw new NotFoundException(`No orders found for user ID: ${userId}`);
    }

    return orders;
  }
}

