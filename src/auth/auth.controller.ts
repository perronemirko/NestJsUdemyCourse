import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialDto :AuthCredentialsDto): Promise<void>{
        //console.log(authCredentialDto);
        return this.authService.signUp(authCredentialDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialDto :AuthCredentialsDto):  Promise< { accessToken: string } > {
        //console.log(authCredentialDto);
        return this.authService.signIn(authCredentialDto);
    }

    // @Post('/test')
    // @UseGuards(AuthGuard())
    // test(@Req() req){
    //     //console.log('req => ', req.user);
        
    // }

    // @Post('/tests')
    // @UseGuards(AuthGuard())
    // tests(@GetUser() user: User){
    //     console.log('req => ', user);
        
    // }

}
