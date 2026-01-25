import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @Column()
    object_name: string;
    @Column()
    glb_upload: string;
    @Column()
    preview: string;
}