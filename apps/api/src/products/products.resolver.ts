import { Query, Resolver } from '@nestjs/graphql';
import { Product } from './product.model';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private svc: ProductsService) {}
  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return this.svc.list();
  }
}