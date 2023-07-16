import {createParamDecorator, ExecutionContext, NotFoundException} from '@nestjs/common'
import { request } from 'http'

export const User = createParamDecorator((filter:string, context: ExecutionContext)=>{

    const request =  context.switchToHttp().getRequest()

    if(request.user){
        //Caso eu queira filtar pelo um dado especifico do usuario
        if(filter){
            return request.user[filter]
        }else{
            return request.user
        }
        
    }else{
        throw new NotFoundException("Usuario não encontrado no Request!. Precisa definir ele no authGuard")
    }



})