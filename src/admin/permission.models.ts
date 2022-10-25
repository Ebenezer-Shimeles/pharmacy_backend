





import { Column, PrimaryGeneratedColumn, Entity, BaseEntity, CreateDateColumn } from "typeorm";



@Entity({name: 'permissions'})
export class Permission{
    @PrimaryGeneratedColumn()
    id: number;


    @Column({name: 'permission_name', nullable: false})
    permissionName: string;
}