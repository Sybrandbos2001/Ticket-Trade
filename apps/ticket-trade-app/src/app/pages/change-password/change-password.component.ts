import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { SweetalertService } from '../../services/sweetalert/sweetalert.service';
import { MatDivider } from '@angular/material/divider';
import { ChangePasswordDto } from '../../services/auth/dto/change-password.dto';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatCardModule,    
    MatDivider,   
    MatFormFieldModule,  
    MatInputModule,      
    MatButtonModule,
    RouterModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sweetAlertService: SweetalertService,
  ) {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
          ],
        ],
        confirmNewPassword: ['', Validators.required],
      },
      {
        validators: [this.passwordMatchValidator],
      }
    );
  }

  get passwordErrorMessage(): string {
    const passwordControl = this.changePasswordForm.get('newPassword');
    if (passwordControl?.hasError('required')) {
      return 'Nieuw wachtwoord is verplicht.';
    } else if (passwordControl?.hasError('minlength')) {
      return 'Wachtwoord moet minimaal 8 tekens lang zijn.';
    } else if (passwordControl?.hasError('pattern')) {
      return 'Minimaal 1 hoofdletter, 1 kleine letter, 1 cijfer en 1 teken.';
    }
    return '';
  }
  
  passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
  
    return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword } = this.changePasswordForm.value;
      const changePasswordDto: ChangePasswordDto = { currentPassword, newPassword };
  
      this.authService.changePassword(changePasswordDto).subscribe({
        next: () => {
          this.sweetAlertService.success(
            'Je wachtwoord is succesvol gewijzigd!',
            'Succes!'
          );
          this.authService.logout();
          this.router.navigate(['/inloggen']);
        },
        error: (error: Error) => {
          this.sweetAlertService.error(
            'Er is iets misgegaan. Controleer je invoer.',
            'Wachtwoord wijzigen mislukt!'
          );
        },
      });
    }
  }
}
