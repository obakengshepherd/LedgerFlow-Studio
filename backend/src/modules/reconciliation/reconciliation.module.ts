import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reconciliation } from './entities/reconciliation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reconciliation])],
  exports: [TypeOrmModule],
})
export class ReconciliationModule {}
