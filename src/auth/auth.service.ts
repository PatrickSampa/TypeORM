import { BadRequestException,ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt'
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserServices } from "src/user/user.services";
import * as bcrypt from 'bcrypt'
import {Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from "src/user/entity/user.entity";


@Injectable()
export class AuthService{
    constructor(private readonly jwtService: JwtService,
                private readonly userService: UserServices,
                @InjectRepository(UserEntity)
                private userRepositiry: Repository<UserEntity>){}

     createToken(user:UserEntity){
        return this.jwtService.sign({
            id:user.id,
            name: user.name,
            email: user.email
        }, {
            expiresIn: "7 days",
            subject: String(user.id),
            issuer: 'login',
            audience: 'users'
        });
    }

     checkToken(token: string){
        try{
            const data =  this.jwtService.verify(token,{
                audience: 'users',
                issuer: 'login'
            })
            return data
        }catch (e){
            throw new BadRequestException(e)
        }
        
    }

    async login(email: string, password: string){

        const user = await this.userRepositiry.findOne({
            where: {
                email
            }
        })
        console.log(user)

        if(!user){
            throw new UnauthorizedException('Email e/ou senha incorretos')
        }

        if(! await bcrypt.compare(password, user.password)){
            throw new UnauthorizedException('Email e/ou senha incorretos')
        }

        return this.createToken(user);
    }

    async forget(email: string){
        const user = await this.userRepositiry.findOneBy({
            email
        });
        if(!user){
            throw new UnauthorizedException('Email e/ou senha incorretos')
        }
        //ENVIAR O EMAIL PARA O USER
        return true
    
    }

    async reset(password: string, token:string){
        //validar o token
        try{
            const data: any = this.jwtService.verify(token, {
                audience: 'users',
                issuer: 'login'
            });

            if(isNaN(Number(data.id))){
                throw new BadRequestException("Token Invalido!!")
            }

            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);

            await this.userRepositiry.update(Number(data.id),{
                password
            })
            const user = await this.userService.show(Number(data.id))

            return this.createToken(user);
        }catch (e){

        }

       
    }


    async register(data: AuthRegisterDTO){
        const UserExistente = await this.UserJaCadastrado(data.email)
        console.log(UserExistente)
        console.log(JSON.stringify(UserExistente)) 
        if(UserExistente){
            console.log("entrou if")
            throw new ConflictException("Usuário já existe")
        }
        console.log("PASSOU")
        const user = await this.userService.create(data);
        
        return this.createToken(user);
        
    }

    async UserJaCadastrado(email: string){
        return await this.userRepositiry.findOne({
            where :{
                email
            }
        })
    }


    

}