import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { LedgerService, CreateDoubleEntryDto } from './ledger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('ledger')
@Controller('api/v1/ledger')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  /**
   * Create a double-entry transaction
   * Only ACCOUNTANT and ADMIN roles can create transactions
   */
  @Post('transaction')
  @Roles('ACCOUNTANT', 'ADMIN')
  @ApiOperation({
    summary: 'Create double-entry transaction',
    description: 'Creates a balanced debit-credit transaction in the immutable ledger',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
  })
  async createTransaction(
    @Body() dto: CreateDoubleEntryDto,
    @Request() req,
  ) {
    return this.ledgerService.createDoubleEntry({
      ...dto,
      createdBy: req.user.userId,
    });
  }

  /**
   * Reverse an existing transaction
   * Only ADMIN can reverse transactions
   */
  @Post('transaction/:transactionId/reverse')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Reverse a transaction',
    description: 'Reverses a transaction by creating offsetting entries',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction reversed successfully',
  })
  async reverseTransaction(
    @Param('transactionId') transactionId: string,
    @Body() body: { reason: string },
    @Request() req,
  ) {
    return this.ledgerService.reverseTransaction(
      transactionId,
      body.reason,
      req.user.userId,
    );
  }

  /**
   * Get ledger entries with filtering and pagination
   */
  @Get('entries')
  @Roles('AUDITOR', 'ACCOUNTANT', 'ADMIN', 'VIEWER')
  @ApiOperation({
    summary: 'Get ledger entries',
    description: 'Retrieve ledger entries with filters and pagination',
  })
  @ApiQuery({ name: 'accountId', required: false })
  @ApiQuery({ name: 'entityId', required: false })
  @ApiQuery({ name: 'transactionId', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Ledger entries retrieved successfully',
  })
  async getEntries(
    @Query('accountId') accountId?: string,
    @Query('entityId') entityId?: string,
    @Query('transactionId') transactionId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.ledgerService.getEntries({
      accountId,
      entityId,
      transactionId,
      limit: limit ? parseInt(limit as any, 10) : 50,
      offset: offset ? parseInt(offset as any, 10) : 0,
    });
  }

  /**
   * Get entries for a specific transaction
   */
  @Get('transaction/:transactionId/entries')
  @Roles('AUDITOR', 'ACCOUNTANT', 'ADMIN', 'VIEWER')
  @ApiOperation({
    summary: 'Get transaction entries',
    description: 'Retrieve debit and credit entries for a specific transaction',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction entries retrieved successfully',
  })
  async getTransactionEntries(@Param('transactionId') transactionId: string) {
    return this.ledgerService.getTransactionEntries(transactionId);
  }

  /**
   * Get current balance for an account
   */
  @Get('account/:accountId/balance')
  @Roles('AUDITOR', 'ACCOUNTANT', 'ADMIN', 'VIEWER')
  @ApiOperation({
    summary: 'Get account balance',
    description: 'Calculate current balance for an account',
  })
  @ApiResponse({
    status: 200,
    description: 'Account balance retrieved successfully',
  })
  async getBalance(
    @Param('accountId') accountId: string,
    @Query('entityId') entityId: string,
    @Query('asOfDate') asOfDate?: string,
  ) {
    const balance = await this.ledgerService.getAccountBalance(
      accountId,
      entityId,
      asOfDate ? new Date(asOfDate) : undefined,
    );

    return {
      accountId,
      entityId,
      balance,
      currency: 'ZAR',
      timestamp: new Date(),
    };
  }

  /**
   * Verify the integrity of the entire ledger
   * Validates cryptographic hash chain
   */
  @Get('verify')
  @Roles('AUDITOR', 'ADMIN')
  @ApiOperation({
    summary: 'Verify ledger integrity',
    description: 'Validates the cryptographic hash chain and detects any tampering',
  })
  @ApiResponse({
    status: 200,
    description: 'Ledger integrity verification completed',
  })
  async verifyIntegrity() {
    return this.ledgerService.verifyIntegrity();
  }
}
