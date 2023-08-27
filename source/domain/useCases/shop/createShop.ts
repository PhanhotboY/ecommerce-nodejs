import { Shop } from '../../entities/shop.entity';
import { UseCase } from '../../interfaces/useCases/useCase.interface';
import { ShopRepository } from '../../repositories/shop.repo';

export abstract class CreateShopUseCase implements UseCase<Shop> {
  abstract execute(...arg: any[]): Shop;
}

export class CreateShopUseCaseImpl implements CreateShopUseCase {
  constructor(private ShopRepo: ShopRepository) {}

  execute(...arg: any[]): Shop {
    throw new Error('Method not implemented!');
  }
}
