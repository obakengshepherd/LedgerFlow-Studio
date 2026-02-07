import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

export enum TransactionType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
}

/**
 * LedgerEntry entity - immutable financial ledger records
 * Each entry is cryptographically linked to the previous entry via hash chaining
 * This implements append-only immutable ledger pattern
 */
@Entity('ledger_entries')
@Index(['accountId', 'timestamp'], { name: 'idx_account_timestamp' })
@Index(['transactionId'], { name: 'idx_transaction_id' })
@Index(['hash'], { name: 'idx_hash', unique: true })
@Index(['previousHash'], { name: 'idx_previous_hash' })
@Index(['entityId', 'status'], { name: 'idx_entity_status' })
@Index(['timestamp'], { name: 'idx_timestamp' })
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Unique identifier for the transaction (groups debit and credit entries)
   */
  @Column({ type: 'uuid' })
  transactionId: string;

  /**
   * Account ID (e.g., GL001, AR100, etc.)
   */
  @Column({ type: 'varchar', length: 100 })
  accountId: string;

  /**
   * Entity ID - which business entity/organization this ledger entry belongs to
   */
  @Column({ type: 'varchar', length: 100 })
  entityId: string;

  /**
   * Debit or Credit indicator
   */
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  /**
   * Transaction amount (always positive, type indicates debit or credit)
   */
  @Column({ type: 'decimal', precision: 20, scale: 2 })
  amount: number;

  /**
   * Currency code (default: ZAR for South African Rand)
   */
  @Column({ type: 'varchar', length: 3, default: 'ZAR' })
  currency: string;

  /**
   * Transaction description for auditing
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  /**
   * JSON metadata for additional transaction context
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  /**
   * Current status of the entry
   */
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  /**
   * Timestamp when entry was created (immutable)
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp: Date;

  /**
   * SHA-256 hash of this entry's data + previous hash (cryptographic chain)
   */
  @Column({ type: 'varchar', length: 64, unique: true })
  hash: string;

  /**
   * Hash of the previous entry (creates immutable chain)
   */
  @Column({ type: 'varchar', length: 64, nullable: true })
  previousHash: string;

  /**
   * User ID who created this entry - for audit trail
   */
  @Column({ type: 'uuid' })
  createdBy: string;

  /**
   * Reference number for reconciliation (e.g., invoice number)
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  referenceNumber: string;

  /**
   * Flag indicating if this entry has been reversed
   */
  @Column({ type: 'boolean', default: false })
  isReversed: boolean;

  /**
   * ID of the reversal entry (if this entry was reversed)
   */
  @Column({ type: 'uuid', nullable: true })
  reversalEntryId: string;

  /**
   * Reason for reversal (if applicable)
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  reversalReason: string;

  /**
   * Helper: Get the balance contribution (debit as negative, credit as positive)
   */
  getBalanceImpact(): number {
    if (this.isReversed) return 0;
    return this.type === TransactionType.CREDIT ? this.amount : -this.amount;
  }
}
