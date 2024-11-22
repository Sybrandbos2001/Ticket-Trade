import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ILogin} from '@ticket-trade/domain';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto implements ILogin {
    
    @ApiProperty({ example: 'john.doe@example.com', description: 'Emailadres of user' })
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @ApiProperty({ example: 'Password@123', description: 'Password of user' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}
