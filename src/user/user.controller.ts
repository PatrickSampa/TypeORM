import { Body, Controller, Delete, Get, Param, Patch, Post, Put, ParseIntPipe, UseInterceptors, UseGuards} from "@nestjs/common";
import { createUserDTO } from "./dto/create-user.dto";
import { updatePutUserDTO } from "./dto/update-put-user.dto";
import { updatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UserServices } from "./user.services";
import { logInterceptors } from "src/interceptors/log.interceptors";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/guards/role.guards";
import { AuthGuard } from "src/guards/auth.guards";
import { SkipThrottle, Throttle } from "@nestjs/throttler/dist/throttler.decorator";

@UseGuards(AuthGuard ,RoleGuard)
@UseInterceptors(logInterceptors)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserServices){}

    @Roles(Role.User)
    @Post()
    async create(@Body() body: createUserDTO){
        return this.userService.create(body);
    }


    //@SkipThrottle() Usado para barrar a config de throller no module.
    //@Throttle(20, 60) nesse decorator você pode definir uma nova config para sua aplicação 
    @Roles(Role.Admin, Role.User)
    @Get()
    async list(){
        return this.userService.list();
    }

    @Roles(Role.Admin)
    @Get(':id')
    async readOne(@Param('id', ParseIntPipe) id: number){
        return this.userService.show(id);
    }


    @Roles(Role.Admin)
    @Put(':id')
    async update(@Body() Body: updatePutUserDTO, @Param('id', ParseIntPipe) id: number){
        return this.userService.update(id,Body)
    }


    @Roles(Role.Admin)
    @Patch(':id')
    async updateParcial(@Body() Body: updatePatchUserDTO,@Param('id', ParseIntPipe) id: number){
        return this.userService.updatePartial(id,Body)
    }


    @Roles(Role.Admin)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number){
        return this.userService.delete(id)
    }






}