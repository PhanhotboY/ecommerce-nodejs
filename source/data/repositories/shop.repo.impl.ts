import { Shop } from '@domain/entities';
import { ShopRepository } from '@domain/repositories';
import { LocalStorageRepo } from '@data/repositories/localStorage.repo';

export class ShopRepositoryImpl implements ShopRepository {
  constructor(private localRepo: LocalStorageRepo) {}

  async findByEmail(email: string): Promise<Shop> {
    this.localRepo.set(email, email);

    throw new Error('Method not implemented!');
  }
}
