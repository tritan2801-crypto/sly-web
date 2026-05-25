import { Controller, Get, Post, Body, Req, Query, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('orders')
  async createOrder(@Body() body: any, @Req() req: any, @Res() res: Response) {
    const items = body.items || [];
    const shippingAddress = (body.shipping_address || '').trim();
    const paymentMethod = body.payment_method || 'COD';
    const notes = (body.notes || '').trim();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Shopping cart is empty.',
      });
    }

    if (!shippingAddress) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Shipping address is required.',
      });
    }

    const orderData: any = {
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      notes,
      subtotal: Number(body.subtotal || 0),
      discount: Number(body.discount || 0),
      shipping_fee: Number(body.shipping_fee || 0),
      total_amount: Number(body.total_amount || 0),
    };

    if (req.session && req.session.user_id) {
      orderData.user_id = Number(req.session.user_id);
    } else {
      const guestName = (body.guest_name || '').trim();
      const guestEmail = (body.guest_email || '').trim();
      const guestPhone = (body.guest_phone || '').trim();

      if (!guestName || !guestPhone) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'Guest name and phone number are required for checkout.',
        });
      }

      orderData.guest_name = guestName;
      orderData.guest_email = guestEmail;
      orderData.guest_phone = guestPhone;
    }

    try {
      const orderCode = await this.orderService.create(orderData, items);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Order placed successfully.',
        data: {
          order_code: orderCode,
        },
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Checkout failed: ' + err.message,
      });
    }
  }

  @Get('orders')
  async getUserOrders(@Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: 'Unauthorized. No active session.',
      });
    }

    try {
      const userId = Number(req.session.user_id);
      const orders = await this.orderService.getUserOrderHistory(userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: orders,
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Get('order/track')
  async trackOrder(
    @Query('order_code') orderCode: string,
    @Query('phone') phone: string,
    @Res() res: Response,
  ) {
    const code = (orderCode || '').trim();
    const tel = (phone || '').trim();

    if (!code) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Order tracking code is required.',
      });
    }

    try {
      const order = await this.orderService.findByCodeOrPhone(code, tel || undefined);
      if (!order) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: 'Order not found. Please verify the code and phone number.',
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        data: order,
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Get('admin/orders')
  async getSystemOrders(@Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id || req.session.user_role !== 'admin') {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: 'Forbidden. Admin privileges required.',
      });
    }

    try {
      const orders = await this.orderService.getAllOrders();
      return res.status(HttpStatus.OK).json({
        success: true,
        data: orders,
      });
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }

  @Post('admin/orders/update-status')
  async updateOrderStatus(@Body() body: any, @Req() req: any, @Res() res: Response) {
    if (!req.session || !req.session.user_id || req.session.user_role !== 'admin') {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: 'Forbidden. Admin privileges required.',
      });
    }

    const orderId = Number(body.order_id || 0);
    const status = (body.status || '').trim();

    if (orderId <= 0 || !status) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Order ID and status are required.',
      });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: 'Invalid order status value.',
      });
    }

    try {
      const success = await this.orderService.updateOrderStatus(orderId, status);
      if (success) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'Order status updated successfully.',
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: 'Failed to update order status.',
        });
      }
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message,
      });
    }
  }
}
