
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { producer } from '../common/kafka';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

@Injectable()
export class OrdersService {
  async createCheckoutSession(lineItems: { price_data: any; quantity: number }[]) {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: 'http://localhost:3000/checkout?success=1',
      cancel_url: 'http://localhost:3000/checkout?canceled=1',
      line_items: lineItems
    });
    return session.url;
  }

  async publishEvent(order: any) {
    await producer.connect();
    await producer.send({
      topic: 'order_created',
      messages: [{ value: JSON.stringify(order) }]
    });
  }
}