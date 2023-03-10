import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'follows'})                 //Table for follower relations - this time doing it manually without many to many relationships by typeorm
export class FollowEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    followerId :number;

    @Column()
    followingId :number;
}