import { EntityRepository, Repository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";


@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredentialDto: AuthCredentialsDto): Promise<void>{
        const{ username, password } = authCredentialDto;
        
        const user = new User();
        user.username = username;  
        user.salt = await bcrypt.genSalt();; 
        user.password = await this.hashPassword(password, user.salt);
        console.log(user);
        try {
            await user.save();
        } catch (error) {
            if (error.code === "23505") {
                console.error(error + "Username already exist." ); 
                throw new ConflictException("Username already exist.");    
            }else {
            console.error(error); 
            throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string>{
        const { username, password} = authCredentialsDto;
        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

}