import { PartialType } from "@nestjs/mapped-types";
import { createUserDTO } from "./create-user.dto";


export class updatePatchUserDTO extends PartialType(createUserDTO){ 

    


}