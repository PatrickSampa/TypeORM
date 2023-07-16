import { Module } from "@nestjs/common/decorators/modules";
import { UserController } from "./user.controller";
import { UserServices } from "./user.services";
import { AuthModule } from "src/auth/auth.module";
import { forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from "./entity/user.entity";

@Module({
    imports: [forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserServices],
    exports: [UserServices]
})



export class UserModule {}