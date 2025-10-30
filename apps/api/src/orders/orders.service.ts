import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryClientService } from '../inventory/inventory-client.service';
import Stripe from 'stripe';
import { producer } from '../common/kafka';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private inventoryClient: InventoryClientService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890');
  }

  async create(createOrderDto: CreateOrderDto): Promise<{ order: OrderResponseDto; checkoutUrl: string }> {
    // Validate inventory availability
    for (const item of createOrderDto.items) {
      const stock = await this.inventoryClient.getStock(item.productId);
      if (stock.available < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${item.productId}`);
      }
    }

    // Reserve stock
    for (const item of createOrderDto.items) {
      const reserved = await this.inventoryClient.reserveStock(item.productId, item.quantity);
      if (!reserved) {
        throw new BadRequestException(`Failed to reserve stock for product ${item.productId}`);
      }
    }

    // Calculate total amount
    const amountCents = createOrderDto.items.reduce(
      (total, item) => total + (item.priceCents * item.quantity),
      0
    );

    // Create order in database
    const order = await this.prisma.order.create({
      data: {
        email: createOrderDto.email,
        amountCents,
        items: createOrderDto.items,
        shippingAddress: createOrderDto.shippingAddress,
      },
    });

    // Create Stripe checkout session
    const lineItems = createOrderDto.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Product ${item.productId}`,
        },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/checkout?success=1&orderId=${order.id}`,
      cancel_url: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/checkout?canceled=1&orderId=${order.id}`,
      line_items: lineItems,
      metadata: {
        orderId: order.id.toString(),
      },
    });

    // Update order with Stripe session ID
    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return {
      order: updatedOrder as OrderResponseDto,
      checkoutUrl: session.url!,
    };
  }

  async findById(id: number): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order as OrderResponseDto;
  }

  async findByEmail(email: string): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });

    return orders as OrderResponseDto[];
  }

  async updateStatus(id: number, status: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });

    return order as OrderResponseDto;
  }

  async publishOrderCreatedEvent(order: OrderResponseDto): Promise<void> {
    try {
      await producer.connect();
      await producer.send({
        topic: 'order_created',
        messages: [{
          key: order.id.toString(),
          value: JSON.stringify({
            orderId: order.id,
            email: order.email,
            amountCents: order.amountCents,
            items: order.items,
            timestamp: new Date().toISOString(),
          }),
        }],
      });
      this.logger.log(`Published order_created event for order ${order.id}`);
    } catch (error) {
      this.logger.error(`Failed to publish order_created event for order ${order.id}`, error);
      throw error;
    }
  }

  async handleStripeWebhook(event: any): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const orderId = parseInt(session.metadata.orderId);
        
        if (orderId) {
          await this.updateStatus(orderId, 'PAID');
          const order = await this.findById(orderId);
          await this.publishOrderCreatedEvent(order);
        }
        break;
      
      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        const expiredOrderId = parseInt(expiredSession.metadata.orderId);
        
        if (expiredOrderId) {
          // Release reserved stock
          const order = await this.findById(expiredOrderId);
          for (const item of order.items) {
            await this.inventoryClient.releaseStock(item.productId, item.quantity);
          }
          await this.updateStatus(expiredOrderId, 'CANCELLED');
        }
        break;
    }
  }
}