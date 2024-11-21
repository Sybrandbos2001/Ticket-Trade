import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
    
    @ApiProperty({ example: 'Password@123', description: 'Current password' })
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @ApiProperty({ example: 'Password@123', description: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'New password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    })
    newPassword: string;
}
