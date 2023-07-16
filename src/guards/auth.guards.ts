import { CanActivate, ExecutionContext, Injectable, Inject } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { UserServices } from "src/user/user.services";

@Injectable()
export class AuthGuard implements CanActivate {
    
        constructor(private readonly authService: AuthService,
           private readonly userService: UserServices){}

    async canActivate(context: ExecutionContext){

            const request =  context.switchToHttp().getRequest()
            const {authorization} = request.headers;
        try{
 
            const data = this.authService.checkToken((authorization ?? '').split(' ')[1]);

            request.tokenPaylod = data;

            request.user = await this.userService.show(data.id)
            return true;
        }catch (e){
            return false
        }
        
        
    }
}