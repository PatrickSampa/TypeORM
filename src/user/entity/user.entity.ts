import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm'



@Entity({
    name: 'users'
})
export class UserEntity {
    @PrimaryGeneratedColumn({
        //Não permitir valores negativos
        unsigned: true
    })
    id: number;

    @Column({
        length: 63
    })
    name: string; 

    @Column({
        length: 127,
        unique: true
    })
    email: string;

    @Column() 
    password: string 

    @Column({
        default: 1
    })
    role: number 

    @CreateDateColumn()
    createdAt: string

    @CreateDateColumn()
    updateAt: string




}