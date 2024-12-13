import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';  
import { SweetalertService } from '../../services/sweetalert/sweetalert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatCardModule,       
    MatFormFieldModule,  
    MatInputModule,      
    MatButtonModule,
    CommonModule,
    RouterModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private sweetAlertService: SweetalertService,  ) 
  {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', Validators.required],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^06\d{8}$/),
          ],
        ],
        email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), 
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [this.passwordMatchValidator],
      }
    );
  }

  get passwordErrorMessage(): string {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Wachtwoord is verplicht.';
    } else if (passwordControl?.hasError('minlength')) {
      return 'Wachtwoord moet minimaal 8 tekens lang zijn.';
    } else if (passwordControl?.hasError('pattern')) {
      return 'Minimaal 1 hoofdletter, 1 kleine letter, 1 cijfer en 1 teken.';
    }
    return '';
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPasswordControl = group.get('confirmPassword');
    
    if (password !== confirmPasswordControl?.value) {
      confirmPasswordControl?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPasswordControl?.setErrors(null); 
      return null;
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.value;
      registerData.phone = registerData.phone.replace(/^06/, '+31 6');
      this.authService.register(registerData).subscribe({
        next: () => {
          this.sweetAlertService.success(
            'Je wordt doorgestuurd naar de inlogpagina.',
            'Registratie succesvol!'
          );
          this.router.navigate(['/inloggen']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.errorMessage = 'Email of gebruikersnaam is al bezet.';
          } else {
            this.errorMessage = 'Er is een fout opgetreden. Probeer het later opnieuw.';
          }
      }});
    }
  }
}
