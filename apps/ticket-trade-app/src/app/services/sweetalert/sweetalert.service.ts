import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  success(message: string, title = 'Success') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  error(message: string, title = 'Error') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  warning(message: string, title = 'Waarschuwing') {
    Swal.fire({
      title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK',
    });
  }

  info(message: string, title = 'Informatie') {
    Swal.fire({
      title,
      text: message,
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }
}
