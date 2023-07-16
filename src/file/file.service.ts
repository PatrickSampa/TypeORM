import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import path from 'path';

@Injectable()
export class FileService {
  

    async uploud(file: Express.Multer.File, path: string){
        return writeFile(path, file.buffer)
    }
  
  
}
