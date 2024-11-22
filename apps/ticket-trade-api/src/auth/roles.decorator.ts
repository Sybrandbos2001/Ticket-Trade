import { SetMetadata } from '@nestjs/common';
import { Role } from '@ticket-trade/domain';

// Custom decorator om rollen aan een route toe te wijzen
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
