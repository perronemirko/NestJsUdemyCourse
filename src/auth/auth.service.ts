import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';


@Injectable()
export class AuthService {
    /*When the service initialized Inject the UserRepository instance 
        into the userRepository as an agroument 
        and becaouse of the private parameter it will just become as a class member
        so anywhere in the class we could access this dot userRepository and we simply have access to th
        Repository so we can make some calls. */
    constructor(
        @InjectRepository(UserRepository) 
        private userRepository: UserRepository,
        private jwtServices: JwtService,
        ) {}
        
    
    async signUp(authCredentialDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto):  Promise< { accessToken: string } > {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtServices.sign(payload);

        return {accessToken};
    }
}
