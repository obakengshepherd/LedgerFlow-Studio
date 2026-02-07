import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * @Roles decorator - marks routes with required user roles
 * Usage: @Roles('ADMIN', 'ACCOUNTANT')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
