import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';  

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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) 
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
        email: ['', [Validators.required, Validators.email]],
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
      return 'Wachtwoord moet minimaal een hoofdletter, een kleine letter, een cijfer en een speciaal teken bevatten.';
    }
    return '';
  }

  passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
  
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.value;
      registerData.phone = registerData.phone.replace(/^06/, '+31 6');
      this.authService.register(registerData).subscribe({
        next: () => {
          this.router.navigate(['/inloggen']);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
      }},
      );
    }
  }
}
