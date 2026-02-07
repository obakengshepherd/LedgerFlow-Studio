import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Repository } from 'typeorm';
import { User, UserRole } from './modules/auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

/**
 * Database seed script - Creates default users and initial data
 * Usage: npm run seed
 */
async function seed() {
  const app = await NestFactory.create(AppModule);
  const userRepository = app.get<Repository<User>>('UserRepository');

  console.log('🌱 Starting database seed...');

  try {
    // Default users with different roles
    const defaultUsers = [
      {
        email: 'admin@ledgerflow.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      },
      {
        email: 'accountant@ledgerflow.com',
        password: 'pass123',
        firstName: 'John',
        lastName: 'Accountant',
        role: UserRole.ACCOUNTANT,
      },
      {
        email: 'auditor@ledgerflow.com',
        password: 'pass123',
        firstName: 'Sarah',
        lastName: 'Auditor',
        role: UserRole.AUDITOR,
      },
      {
        email: 'viewer@ledgerflow.com',
        password: 'pass123',
        firstName: 'Peter',
        lastName: 'Viewer',
        role: UserRole.VIEWER,
      },
    ];

    // Create users
    for (const userData of defaultUsers) {
      const existingUser = await userRepository
        .createQueryBuilder()
        .where('email = :email', { email: userData.email })
        .getOne();

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = userRepository.create({
          ...userData,
          password: hashedPassword,
        });
        await userRepository.save(user);
        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`);
      }
    }

    console.log('✅ Database seed completed successfully!');
    console.log('\n📝 Default Users:');
    console.log('└── Email: admin@ledgerflow.com | Password: admin123 | Role: ADMIN');
    console.log('└── Email: accountant@ledgerflow.com | Password: pass123 | Role: ACCOUNTANT');
    console.log('└── Email: auditor@ledgerflow.com | Password: pass123 | Role: AUDITOR');
    console.log('└── Email: viewer@ledgerflow.com | Password: pass123 | Role: VIEWER');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
