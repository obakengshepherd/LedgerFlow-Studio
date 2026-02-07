import { Injectable, BadRequestException, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LedgerEntry, TransactionType, TransactionStatus } from './entities/ledger-entry.entity';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'crypto';

export interface CreateLedgerEntryDto {
  accountId: string;
  entityId: string;
  type: TransactionType;
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdBy: string;
  referenceNumber?: string;
}

export interface CreateDoubleEntryDto {
  transactionId?: string;
  debitAccountId: string;
  creditAccountId: string;
  entityId: string;
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdBy: string;
  referenceNumber?: string;
}

/**
 * LedgerService - Core financial ledger operations
 * Handles immutable append-only ledger with cryptographic integrity
 */
@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntry)
    private ledgerRepository: Repository<LedgerEntry>,
    private dataSource: DataSource,
  ) {}

  /**
   * Generate SHA-256 hash for ledger entry
   * Hash includes: transactionId, accountId, type, amount, timestamp, previousHash
   */
  private generateHash(entry: Partial<LedgerEntry>, previousHash: string | null): string {
    const data = {
      transactionId: entry.transactionId,
      accountId: entry.accountId,
      entityId: entry.entityId,
      type: entry.type,
      amount: entry.amount,
      currency: entry.currency,
      timestamp: entry.timestamp?.toISOString(),
      previousHash: previousHash || 'GENESIS_BLOCK',
    };

    return createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  /**
   * Get the last (most recent) ledger entry hash
   * Used for creating the next link in the chain
   */
  private async getLastHash(): Promise<string | null> {
    const lastEntry = await this.ledgerRepository.findOne({
      where: {},
      order: { timestamp: 'DESC' },
      select: ['hash'],
    });

    return lastEntry?.hash || null;
  }

  /**
   * Create a double-entry transaction (ACID-compliant)
   * This is the primary transaction method - ensures ledger always balances
   * Uses SERIALIZABLE isolation to prevent race conditions
   */
  async createDoubleEntry(dto: CreateDoubleEntryDto): Promise<LedgerEntry[]> {
    // Validation
    if (dto.amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    if (dto.debitAccountId === dto.creditAccountId) {
      throw new BadRequestException('Debit and credit accounts must be different');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // Generate transaction ID if not provided
      const transactionId = dto.transactionId || this.generateTransactionId();
      const timestamp = new Date();

      // Get the chain head
      const previousHash = await this.getLastHash();

      // Create DEBIT entry
      const debitEntry = this.ledgerRepository.create({
        transactionId,
        accountId: dto.debitAccountId,
        entityId: dto.entityId,
        type: TransactionType.DEBIT,
        amount: dto.amount,
        currency: dto.currency || 'ZAR',
        description: dto.description,
        metadata: dto.metadata || {},
        timestamp,
        status: TransactionStatus.PENDING,
        createdBy: dto.createdBy,
        referenceNumber: dto.referenceNumber,
        previousHash,
      });

      // Calculate and assign hash to debit entry
      debitEntry.hash = this.generateHash(debitEntry, previousHash);

      // Save debit entry
      const savedDebit = await queryRunner.manager.save(debitEntry);

      // Create CREDIT entry (chained to debit via its hash)
      const creditEntry = this.ledgerRepository.create({
        transactionId,
        accountId: dto.creditAccountId,
        entityId: dto.entityId,
        type: TransactionType.CREDIT,
        amount: dto.amount,
        currency: dto.currency || 'ZAR',
        description: dto.description,
        metadata: dto.metadata || {},
        timestamp,
        status: TransactionStatus.PENDING,
        createdBy: dto.createdBy,
        referenceNumber: dto.referenceNumber,
        previousHash: savedDebit.hash,
      });

      // Calculate and assign hash to credit entry
      creditEntry.hash = this.generateHash(creditEntry, savedDebit.hash);

      // Save credit entry
      const savedCredit = await queryRunner.manager.save(creditEntry);

      // Post both entries atomically
      savedDebit.status = TransactionStatus.POSTED;
      savedCredit.status = TransactionStatus.POSTED;

      await queryRunner.manager.save([savedDebit, savedCredit]);

      // Commit transaction
      await queryRunner.commitTransaction();

      return [savedDebit, savedCredit];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create transaction: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Reverse a transaction (creates offsetting entries)
   * Original entries are marked as reversed but remain in the ledger (audit trail)
   */
  async reverseTransaction(
    transactionId: string,
    reason: string,
    userId: string,
  ): Promise<LedgerEntry[]> {
    const originalEntries = await this.ledgerRepository.find({
      where: { transactionId },
      order: { timestamp: 'ASC' },
    });

    if (originalEntries.length === 0) {
      throw new NotFoundException('Transaction not found');
    }

    if (originalEntries.some((e) => e.isReversed)) {
      throw new ConflictException('Transaction already reversed');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const reversalId = this.generateTransactionId();
      const reversalEntries: LedgerEntry[] = [];
      let currentPreviousHash = await this.getLastHash();

      // Create reversal entries for each original entry
      for (const original of originalEntries) {
        const reversalEntry = this.ledgerRepository.create({
          transactionId: reversalId,
          accountId: original.accountId,
          entityId: original.entityId,
          // Flip the type: debit becomes credit, credit becomes debit
          type: original.type === TransactionType.DEBIT ? TransactionType.CREDIT : TransactionType.DEBIT,
          amount: original.amount,
          currency: original.currency,
          description: `REVERSAL: ${original.description || 'Transaction reversed'}`,
          metadata: {
            ...original.metadata,
            reversalOf: original.id,
            reversalReason: reason,
          },
          timestamp: new Date(),
          status: TransactionStatus.POSTED,
          createdBy: userId,
          previousHash: currentPreviousHash,
        });

        // Calculate hash
        reversalEntry.hash = this.generateHash(reversalEntry, currentPreviousHash);

        // Save reversal entry
        const saved = await queryRunner.manager.save(reversalEntry);
        reversalEntries.push(saved);

        // Mark original entry as reversed
        original.isReversed = true;
        original.reversalEntryId = saved.id;
        await queryRunner.manager.save(original);

        // Update chain head for next iteration
        currentPreviousHash = saved.hash;
      }

      await queryRunner.commitTransaction();
      return reversalEntries;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to reverse transaction: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Verify the integrity of the entire ledger
   * Validates hash chain and detects any tampering
   */
  async verifyIntegrity(): Promise<{
    valid: boolean;
    totalEntries: number;
    errors: string[];
    timestamp: Date;
  }> {
    try {
      const entries = await this.ledgerRepository.find({
        order: { timestamp: 'ASC' },
      });

      const errors: string[] = [];
      let previousHash: string | null = null;

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        // Verify hash linkage
        const expectedHash = this.generateHash(entry, previousHash);
        if (entry.hash !== expectedHash) {
          errors.push(
            `Hash mismatch at entry ${i + 1} (${entry.id}): expected ${expectedHash}, got ${entry.hash}`,
          );
        }

        // Verify chain continuity
        if (i === 0 && entry.previousHash !== null) {
          // First entry should have no previous hash
          errors.push(`First entry should have no previousHash, but has: ${entry.previousHash}`);
        } else if (i > 0 && entry.previousHash !== previousHash) {
          errors.push(
            `Chain broken at entry ${i + 1} (${entry.id}): previousHash doesn't match chain`,
          );
        }

        previousHash = entry.hash;
      }

      return {
        valid: errors.length === 0,
        totalEntries: entries.length,
        errors,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to verify integrity: ${error.message}`,
      );
    }
  }

  /**
   * Get account balance at a specific point in time
   * Sums all debits (negative) and credits (positive) for the account
   * Excludes reversed transactions
   */
  async getAccountBalance(
    accountId: string,
    entityId: string,
    asOfDate?: Date,
  ): Promise<number> {
    try {
      let query = this.ledgerRepository
        .createQueryBuilder('entry')
        .select(
          `SUM(CASE WHEN entry.type = :credit THEN entry.amount ELSE -entry.amount END)`,
          'balance',
        )
        .where('entry.accountId = :accountId', { accountId })
        .andWhere('entry.entityId = :entityId', { entityId })
        .andWhere('entry.status = :status', { status: TransactionStatus.POSTED })
        .andWhere('entry.isReversed = :reversed', { reversed: false });

      if (asOfDate) {
        query = query.andWhere('entry.timestamp <= :asOfDate', { asOfDate });
      }

      query = query.setParameter('credit', TransactionType.CREDIT);

      const result = await query.getRawOne();

      return parseFloat(result?.balance || '0');
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to calculate balance: ${error.message}`,
      );
    }
  }

  /**
   * Get ledger entries with advanced filtering
   * Supports pagination, date ranges, and entity/account filtering
   */
  async getEntries(filters: {
    accountId?: string;
    entityId?: string;
    transactionId?: string;
    startDate?: Date;
    endDate?: Date;
    excludeReversed?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ entries: LedgerEntry[]; total: number }> {
    try {
      const query = this.ledgerRepository.createQueryBuilder('entry');

      if (filters.accountId) {
        query.andWhere('entry.accountId = :accountId', { accountId: filters.accountId });
      }

      if (filters.entityId) {
        query.andWhere('entry.entityId = :entityId', { entityId: filters.entityId });
      }

      if (filters.transactionId) {
        query.andWhere('entry.transactionId = :transactionId', {
          transactionId: filters.transactionId,
        });
      }

      if (filters.startDate) {
        query.andWhere('entry.timestamp >= :startDate', { startDate: filters.startDate });
      }

      if (filters.endDate) {
        query.andWhere('entry.timestamp <= :endDate', { endDate: filters.endDate });
      }

      if (filters.excludeReversed) {
        query.andWhere('entry.isReversed = :isReversed', { isReversed: false });
      }

      // Get total count before pagination
      const total = await query.getCount();

      // Apply pagination
      query.orderBy('entry.timestamp', 'DESC');

      if (filters.limit) {
        query.take(filters.limit);
      }

      if (filters.offset) {
        query.skip(filters.offset);
      }

      const entries = await query.getMany();

      return { entries, total };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get entries: ${error.message}`,
      );
    }
  }

  /**
   * Get entries for a specific transaction (debit + credit)
   */
  async getTransactionEntries(transactionId: string): Promise<LedgerEntry[]> {
    try {
      return await this.ledgerRepository.find({
        where: { transactionId },
        order: { timestamp: 'ASC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get transaction entries: ${error.message}`,
      );
    }
  }

  /**
   * Generate a unique transaction ID
   */
  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}
