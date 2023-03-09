import { Entity, PrimaryGeneratedColumn , Column, BeforeInsert, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { genSalt, hash } from 'bcrypt';
import { ArticleEntity } from "@app/article/article.entity";

@Entity({ name: 'users' })
export class UserEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;    

    @Column()
    username: string;
 
    @Column({ default: '' })    //Adding default values
    bio: string;
    
    @Column({ default: '' })
    image: string;
    
    @Column({ select: false })
    password: string;

    @BeforeInsert()
    async hashPassword(){
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
    }

    @OneToMany(() => ArticleEntity, (article) => article.author)        //User creates an article
    articles: ArticleEntity[]

    @ManyToMany(() => ArticleEntity)                                    // One User can like multiple articles; an article can be liked by multiple users
    @JoinTable()
    favorites: ArticleEntity[];
}