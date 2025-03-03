// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Order, OrderDocument } from './orders.entity';

// @Injectable()
// export class OrdersService {
//   constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

//   async createOrder(orderData: Partial<Order>): Promise<Order> {
//     const order = new this.orderModel({ ...orderData, status: 'Pending' });
//     return order.save();
//   }

//   async getOrdersByUser(userId: string): Promise<Order[]> {
//     return this.orderModel.find({ userId }).exec();
//   }
// }
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './orders.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  // async createOrder(orderData: Partial<Order>): Promise<Order> {
  //   const order = new this.orderModel({
  //     ...orderData,
  //     status: 'Pending',
  //     createdAt: new Date().toISOString(), // ✅ Ensure timestamp is saved
  //   });
  //   return order.save();
  // }
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = new this.orderModel({
      ...orderData,
      status: 'Pending',
      items: orderData.items?.map(item => ({
        id: item.id || null,   // ✅ Store Product ID
        name: item.name || "Unknown Product",  // ✅ Ensure product name
        title: item.title || "No Title",  // ✅ Store Title if available
        price: item.price || 0,  // ✅ Ensure price is stored
        quantity: item.quantity || 1,  // ✅ Default quantity to 1
        category: item.category || "Unknown",  // ✅ Ensure category
        image: item.image || ""  // ✅ Ensure image URL
      })),
      createdAt: new Date().toISOString(),  // ✅ Ensure timestamp
    });
  
    return order.save();
  }
  
  

  // async getOrdersByUser(userId: string): Promise<Order[]> {
  //   const orders = await this.orderModel.find({ userId }).exec();
  //   console.log("Fetched Orders from DB:", orders); // Debugging output
  //   return orders;
  // }
  async getOrdersByUser(userId: string): Promise<Order[]> {
    const orders = await this.orderModel.find({ userId }).exec();
    // console.log("Fetched Orders from DB:", JSON.stringify(orders, null, 2)); // ✅ Log full order details
    return orders;
  }
  
  
}
