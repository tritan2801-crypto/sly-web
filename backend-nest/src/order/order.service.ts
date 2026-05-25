import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(orderData: any, items: any[]) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Generate unique order code
      const orderCode = 'SLY-' + crypto.randomBytes(4).toString('hex').toUpperCase();

      // 2. Insert order details
      const order = await tx.orders.create({
        data: {
          order_code: orderCode,
          user_id: orderData.user_id ? Number(orderData.user_id) : null,
          guest_name: orderData.guest_name || null,
          guest_email: orderData.guest_email || null,
          guest_phone: orderData.guest_phone || null,
          shipping_address: orderData.shipping_address,
          subtotal: orderData.subtotal,
          discount: orderData.discount || 0,
          shipping_fee: orderData.shipping_fee || 0,
          total_amount: orderData.total_amount,
          payment_method: orderData.payment_method || 'COD',
          payment_status: 'pending',
          order_status: 'pending',
          notes: orderData.notes || null,
        },
      });

      // 3. Insert order items & decrement variant stock
      for (const item of items) {
        const variantId = Number(item.variant_id);
        const quantity = Number(item.quantity);

        // Fetch variant stock
        const variant = await tx.product_variants.findUnique({
          where: { id: variantId },
        });

        if (!variant) {
          throw new BadRequestException('Product variant not found.');
        }

        if (variant.stock < quantity) {
          throw new BadRequestException(`Insufficient stock for variant ID: ${variantId}`);
        }

        // Insert order item
        await tx.order_items.create({
          data: {
            order_id: order.id,
            product_variant_id: variantId,
            quantity: quantity,
            price: item.price,
          },
        });

        // Decrement stock
        await tx.product_variants.update({
          where: { id: variantId },
          data: {
            stock: { decrement: quantity },
          },
        });
      }

      // 4. Update Loyalty Points if user is logged in
      if (orderData.user_id) {
        const userId = Number(orderData.user_id);
        const pointsEarned = Math.floor(Number(orderData.total_amount) / 10000);

        if (pointsEarned > 0) {
          // Increment points
          await tx.customer_loyalty.update({
            where: { user_id: userId },
            data: {
              current_points: { increment: pointsEarned },
              lifetime_points: { increment: pointsEarned },
            },
          });

          // Fetch updated loyalty record
          const updatedLoyalty = await tx.customer_loyalty.findUnique({
            where: { user_id: userId },
          });

          if (updatedLoyalty) {
            // Find membership tier matching lifetime points
            const matchingTier = await tx.membership_tiers.findFirst({
              where: {
                min_points: { lte: updatedLoyalty.lifetime_points },
              },
              orderBy: {
                min_points: 'desc',
              },
            });

            if (matchingTier) {
              await tx.customer_loyalty.update({
                where: { user_id: userId },
                data: {
                  membership_tier_id: matchingTier.id,
                },
              });
            }
          }
        }
      }

      return orderCode;
    });
  }

  async findByCodeOrPhone(orderCode: string, phone?: string) {
    const order = await this.prisma.orders.findUnique({
      where: { order_code: orderCode },
      include: {
        users: true,
      },
    });

    if (!order) return null;

    // Verify phone matches if provided
    if (phone) {
      const matchGuestPhone = order.guest_phone === phone;
      const matchUserPhone = order.users?.phone === phone;
      if (!matchGuestPhone && !matchUserPhone) {
        return null;
      }
    }

    const items = await this.getOrderItems(order.id);

    return {
      id: order.id,
      order_code: order.order_code,
      user_id: order.user_id,
      user_name: order.users?.name || null,
      guest_name: order.guest_name,
      guest_email: order.guest_email,
      guest_phone: order.guest_phone,
      shipping_address: order.shipping_address,
      subtotal: Number(order.subtotal),
      discount: order.discount ? Number(order.discount) : 0,
      shipping_fee: order.shipping_fee ? Number(order.shipping_fee) : 0,
      total_amount: Number(order.total_amount),
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      order_status: order.order_status,
      tracking_number: order.tracking_number,
      notes: order.notes,
      created_at: order.created_at,
      updated_at: order.updated_at,
      items,
    };
  }

  async getUserOrderHistory(userId: number) {
    const orders = await this.prisma.orders.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    const result: any[] = [];
    for (const order of orders) {
      const items = await this.getOrderItems(order.id);
      result.push({
        id: order.id,
        order_code: order.order_code,
        total_amount: Number(order.total_amount),
        order_status: order.order_status,
        created_at: order.created_at,
        items,
      });
    }

    return result;
  }

  async getAllOrders() {
    const orders = await this.prisma.orders.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        users: true,
      },
    });

    const result: any[] = [];
    for (const order of orders) {
      const items = await this.getOrderItems(order.id);
      result.push({
        id: order.id,
        order_code: order.order_code,
        user_id: order.user_id,
        customer_name: order.users?.name || order.guest_name,
        customer_email: order.users?.email || order.guest_email,
        guest_phone: order.guest_phone,
        shipping_address: order.shipping_address,
        subtotal: Number(order.subtotal),
        discount: order.discount ? Number(order.discount) : 0,
        shipping_fee: order.shipping_fee ? Number(order.shipping_fee) : 0,
        total_amount: Number(order.total_amount),
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        order_status: order.order_status,
        tracking_number: order.tracking_number,
        notes: order.notes,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items,
      });
    }

    return result;
  }

  async updateOrderStatus(orderId: number, status: string) {
    await this.prisma.orders.update({
      where: { id: orderId },
      data: {
        order_status: status as any,
      },
    });
    return true;
  }

  private async getOrderItems(orderId: number) {
    const items = await this.prisma.order_items.findMany({
      where: { order_id: orderId },
      include: {
        product_variants: {
          include: {
            products: {
              include: {
                product_images: {
                  where: { is_hover_alternate: false },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    return items.map(oi => {
      const product = oi.product_variants?.products;
      const image = product?.product_images[0]?.image_url || null;

      return {
        id: oi.id,
        quantity: oi.quantity,
        price: Number(oi.price),
        size: oi.product_variants?.size || null,
        color: oi.product_variants?.color || null,
        product_name: product?.name || null,
        product_slug: product?.slug || null,
        product_image: image,
      };
    });
  }
}
