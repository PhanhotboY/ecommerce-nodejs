import { Shop } from '../entities/shop.entity';

export abstract class ShopRepository {
  abstract findByEmail(email: string): Promise<Shop>;
}
