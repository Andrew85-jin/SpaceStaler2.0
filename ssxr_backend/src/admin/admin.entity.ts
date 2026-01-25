import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    object_name: string;

    @Column({type:"float", nullable: true})
    width: number | null;

    @Column({type:"float", nullable: true})
    height: number | null;

    @Column({type:"float", nullable: true})
    length: number | null;

    @Column()
    glb_path: string;

    @Column('json')
    images: string[];
}