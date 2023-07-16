import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { tap } from "rxjs";


export class logInterceptors implements NestInterceptor{
    
    intercept(context: ExecutionContext, next: CallHandler){

        const dt = Date.now();

        return next.handle().pipe(tap(() =>{

            const request = context.switchToHttp().getRequest();

            console.log(`URL: ${request.url}`)
            console.log(`A execução levou ${Date.now() - dt} milisegundos`)
        }))
    }
}