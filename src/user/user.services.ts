import { Injectable, NotAcceptableException, NotFoundException, BadRequestException } from "@nestjs/common";
import { createUserDTO } from "./dto/create-user.dto";
import { updatePutUserDTO } from "./dto/update-put-user.dto";
import { updatePatchUserDTO } from "./dto/update-patch-user.dto";
import * as bcrypt from 'bcrypt'
import { UserEntity } from "./entity/user.entity";
import {Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UserServices{
    constructor(
        @InjectRepository(UserEntity)
        private userRepositiry: Repository<UserEntity>
    ) {}

    async create(data: createUserDTO){
        //Verificar User existente
       
            if(await this.userRepositiry.exist({
                where:{
                    email: data.email
                }
            })){
                throw new BadRequestException('Este Email já existe')
            }
        

        const salt = await bcrypt.genSalt();

        data.password = await bcrypt.hash(data.password, salt);
        
        const user = await this.userRepositiry.create(data)

        return this.userRepositiry.save(user)


    }

    async list(){

        return this.userRepositiry.find();
    }

    async show(id:number){
        //VERIFICAR EXISTENCIA DO USER(PODE CRIAR UMA FUNCAO SEPARADA, ESTOU COM PREGUICA NO MOMENTO)
        if(!(await this.userRepositiry.count({
            where:{
                id
            }
        }))){
            throw new  NotFoundException(`O usuário ${id} não existe`)
        }
        
        return this.userRepositiry.findOneBy({  
                id
        })
    }

    async update(id: number,{email, name, password, role}:updatePutUserDTO){

        if(!(await this.show(id))){
            throw new  NotFoundException(`O usuário ${id} não existe`)
        }
        const salt = await bcrypt.genSalt();

        password = await bcrypt.hash(password, salt);

        await this.userRepositiry.update(id,{
            email,
            name, 
            password, 
            role
        })

        return this.show(id)
    }

    async updatePartial(id: number, {email, name, password, role}){

        if(!(await this.show(id))){
            throw new  NotFoundException(`O usuário ${id} não existe`)
        }

        const data: any = {};
        if(email){
            data.email = email;
        }
        if(name){
            data.name = name;
        }
        if(password){
            const salt = await bcrypt.genSalt();

            data.password = await bcrypt.hash(password, salt);
            
        }
        if(role){
            data.role = role
        }

        await this.userRepositiry.update(id,data)

        return this.show(id)
    }

    async delete(id: number){

        if(!(await this.show(id))){
            throw new  NotFoundException(`O usuário ${id} não existe`)
        }


        return this.userRepositiry.delete(id)
    }


}