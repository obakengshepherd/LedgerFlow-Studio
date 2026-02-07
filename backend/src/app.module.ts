import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerModule } from './modules/ledger/ledger.module';
import { AuditModule } from './modules/audit/audit.module';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/auth/entities/user.entity';
import { LedgerEntry } from './modules/ledger/entities/ledger-entry.entity';
import { AuditLog } from './modules/audit/entities/audit-log.entity';
import { Reconciliation } from './modules/reconciliation/entities/reconciliation.entity';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database configuration
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'ledgerflow'),
        entities: [User, LedgerEntry, AuditLog, Reconciliation],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('LOG_LEVEL') === 'debug',
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),

    // Feature modules
    AuthModule,
    UserModule,
    LedgerModule,
    AuditModule,
    ReconciliationModule,
    ComplianceModule,
  ],
})
export class AppModule {}
