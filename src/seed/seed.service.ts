import { Injectable } from '@nestjs/common';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
 async runSeed(){
  await this.deleteTables();
  const adminUser = await this.insertUsers();
  await this.insertProducts(adminUser);
  return 'Seed executed'
 }

 private async deleteTables(){
  await this.productService.dedleteAllProducts();
  const queryBuilder = this.userRepository.createQueryBuilder();
  await queryBuilder
    .delete()
    .where({})
    .execute()

 }
 private async insertUsers(){
  const seedUsers = initialData.users;
  const users: User[] = [];
  seedUsers.forEach(user => users.push(this.userRepository.create(user)));
  const dbUsers = await this.userRepository.save(seedUsers)
  return dbUsers[0];
 }

 private async insertProducts(user: User) {
  await this.productService.dedleteAllProducts();
  const products = initialData.products;
  const insertPromises: Promise<any>[] = [];
  products.forEach(product => {
    insertPromises.push(this.productService.create(product, user));
  })
  await Promise.all(insertPromises);
  return true;
 }
}
