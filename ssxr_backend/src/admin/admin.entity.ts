import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @Column()
    paramiters: string;
    @Column()
    glb_upload: string;
    @Column()
    preview: string;
}