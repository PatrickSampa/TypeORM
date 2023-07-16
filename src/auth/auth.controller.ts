import { Body, Controller, Post, Req, UseGuards, UseInterceptors , BadRequestException, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator} from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UserServices } from "src/user/user.services";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guards";
import { User } from "src/decorators/user.decorator";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { UploadedFile, UploadedFiles} from "@nestjs/common/decorators";
import { writeFile } from "fs/promises";
import { join } from "path";
import { FileService } from "src/file/file.service";

 


@Controller('auth')
export class AuthController{
    constructor(private readonly userService: UserServices,
                private readonly authService: AuthService,
                private readonly fileService: FileService){}


    @Post('login')
    async login(@Body() {email, password}: AuthLoginDTO){
        console.log("entrou")
        return this.authService.login(email, password);
    }

    @Post('register')
    async register(@Body() Body: AuthRegisterDTO){
        console.log(Body)
        return this.authService.register(Body)

    }
    

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDTO){
        return this.authService.forget(email)
    }

    @Post('reset')
    async reset(@Body() {password, token}:AuthResetDTO){
        return this.authService.reset(password, token)
    }

    //o guard tem uma responsabilidade apenas
    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User('') user){
        
        return {user}
        /* return await this.authService.checkToken(token.split(' ')[1]) */
        
    }


    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadFile(@User() user, @UploadedFile(
        new ParseFilePipe({
            validators: [
                //Regra no uploud de imagem para o servidor
                new FileTypeValidator({fileType: 'image/jpeg'}),
                new MaxFileSizeValidator({maxSize: 1024 * 50})
            ]
        })
    ) photo: Express.Multer.File){

        const path = join(__dirname, '..', '..', 'storage', 'photo', `photo-${user.id}.png`)

        try{

        
         await this.fileService.uploud(photo, path)
         return {photo}
        }catch (e){
            throw new BadRequestException(e)
        }
         
    }



    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('photos')
    async photosFile(@User() user, @UploadedFiles() photos: Express.Multer.File[]){

       
        return photos
         
    }


    
    @UseInterceptors(FileFieldsInterceptor([{
        name: 'photo',
        maxCount: 1
    }, {
        name: 'documents',
        maxCount: 10
    }]))
    @UseGuards(AuthGuard)
    @Post('photos-fields')
    async Updloudphotosfields(@User() user, @UploadedFiles() photos: {photo: Express.Multer.File, documents: Express.Multer.File[]}){

       
        return {photos}
         
    }

}