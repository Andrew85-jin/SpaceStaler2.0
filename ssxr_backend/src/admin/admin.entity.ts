import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    object_name: string;

    @Column({nullable: true})
    width: number;

    @Column({nullable: true})
    height: number;

    @Column({nullable: true})
    length: number;

    @Column()
    glb_path: string;

    @Column('json')
    images: string[];
}