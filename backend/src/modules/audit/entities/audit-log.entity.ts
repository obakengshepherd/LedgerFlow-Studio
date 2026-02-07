import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

export enum AuditAction {
  CREATE_TRANSACTION = 'CREATE_TRANSACTION',
  REVERSE_TRANSACTION = 'REVERSE_TRANSACTION',
  VERIFY_INTEGRITY = 'VERIFY_INTEGRITY',
  EXPORT_REPORT = 'EXPORT_REPORT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  UPDATE_USER = 'UPDATE_USER',
}

/**
 * AuditLog entity - immutable audit trail for all system actions
 * Maintains complete history for regulatory compliance
 */
@Entity('audit_logs')
@Index(['userId', 'timestamp'], { name: 'idx_user_timestamp' })
@Index(['action', 'timestamp'], { name: 'idx_action_timestamp' })
@Index(['entityId'], { name: 'idx_entity_id' })
@Index(['timestamp'], { name: 'idx_audit_timestamp' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * User who performed the action
   */
  @Column({ type: 'uuid' })
  userId: string;

  /**
   * Type of action performed
   */
  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  /**
   * Entity ID affected by this action
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  entityId: string;

  /**
   * Resource ID (e.g., transaction ID)
   */
  @Column({ type: 'uuid', nullable: true })
  resourceId: string;

  /**
   * User's IP address
   */
  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  /**
   * User agent string
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string;

  /**
   * Old values (for update actions)
   */
  @Column({ type: 'jsonb', nullable: true })
  oldValues: Record<string, any>;

  /**
   * New values (for create/update actions)
   */
  @Column({ type: 'jsonb', nullable: true })
  newValues: Record<string, any>;

  /**
   * Status of the action (SUCCESS, FAILURE)
   */
  @Column({ type: 'varchar', length: 50, default: 'SUCCESS' })
  status: string;

  /**
   * Error message (if action failed)
   */
  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  /**
   * Timestamp of the action
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp: Date;
}
