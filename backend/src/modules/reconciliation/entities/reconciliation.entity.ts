import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ReconciliationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * Reconciliation entity - tracks account reconciliation workflows
 * Used to reconcile ledger entries with source documents
 */
@Entity('reconciliations')
@Index(['entityId', 'accountId'], { name: 'idx_entity_account' })
@Index(['status', 'dueDate'], { name: 'idx_status_due' })
@Index(['periodStart', 'periodEnd'], { name: 'idx_period' })
export class Reconciliation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Entity ID
   */
  @Column({ type: 'varchar', length: 100 })
  entityId: string;

  /**
   * Account ID being reconciled
   */
  @Column({ type: 'varchar', length: 100 })
  accountId: string;

  /**
   * Period start date
   */
  @Column({ type: 'date' })
  periodStart: Date;

  /**
   * Period end date
   */
  @Column({ type: 'date' })
  periodEnd: Date;

  /**
   * Ledger balance at end of period
   */
  @Column({ type: 'decimal', precision: 20, scale: 2 })
  ledgerBalance: number;

  /**
   * Bank/source balance to reconcile against
   */
  @Column({ type: 'decimal', precision: 20, scale: 2 })
  sourceBalance: number;

  /**
   * Difference amount
   */
  @Column({ type: 'decimal', precision: 20, scale: 2 })
  difference: number;

  /**
   * Current status
   */
  @Column({
    type: 'enum',
    enum: ReconciliationStatus,
    default: ReconciliationStatus.PENDING,
  })
  status: ReconciliationStatus;

  /**
   * Notes about the reconciliation
   */
  @Column({ type: 'text', nullable: true })
  notes: string;

  /**
   * User who performed the reconciliation
   */
  @Column({ type: 'uuid', nullable: true })
  performedBy: string;

  /**
   * Due date for completion
   */
  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  /**
   * Check if reconciliation is balanced
   */
  isBalanced(): boolean {
    return Math.abs(this.difference) < 0.01; // Allow for rounding
  }
}
