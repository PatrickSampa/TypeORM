import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "src/auth/auth.service";
import { Role } from "src/enums/role.enum";
import { UserServices } from "src/user/user.services";

@Injectable()
export class RoleGuard implements CanActivate {
        constructor(private readonly reflector: Reflector){}

    async canActivate(context: ExecutionContext){

            const {user} =  context.switchToHttp().getRequest()
          
            const requeridRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()])
            console.log(requeridRoles)

            if(!requeridRoles){
                return true;
            }

            const rolesFilted = requeridRoles.filter(role => role === user.role)
            console.log(rolesFilted.length)

            return rolesFilted.length > 0
            
        
    }
}