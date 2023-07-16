import { Role } from '../enums/role.enum'
import { SetMetadata } from '@nestjs/common';


export const Roles = (...Roles: Role[]) => SetMetadata('roles', Roles)