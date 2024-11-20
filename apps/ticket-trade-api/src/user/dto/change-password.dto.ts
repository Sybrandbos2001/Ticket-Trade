import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
    
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'New password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    })
    newPassword: string;
}
