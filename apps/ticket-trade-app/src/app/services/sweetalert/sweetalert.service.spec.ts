import { TestBed } from '@angular/core/testing';
import Swal from 'sweetalert2';
import { SweetalertService } from './sweetalert.service';

describe('SweetalertService', () => {
  let service: SweetalertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SweetalertService]
    });

    service = TestBed.inject(SweetalertService);
    jest.spyOn(Swal, 'fire');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#success', () => {
    it('should display a success alert', () => {
      const message = 'Operation was successful';
      const title = 'Success';

      service.success(message, title);

      expect(Swal.fire).toHaveBeenCalledWith({
        title: title,
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    });
  });

  describe('#error', () => {
    it('should display an error alert', () => {
      const message = 'An error occurred';
      const title = 'Error';

      service.error(message, title);

      expect(Swal.fire).toHaveBeenCalledWith({
        title: title,
        text: message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    });
  });

  describe('#warning', () => {
    it('should display a warning alert', () => {
      const message = 'This is a warning';
      const title = 'Waarschuwing';

      service.warning(message, title);

      expect(Swal.fire).toHaveBeenCalledWith({
        title: title,
        text: message,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    });
  });

  describe('#info', () => {
    it('should display an info alert', () => {
      const message = 'Here is some information';
      const title = 'Informatie';

      service.info(message, title);

      expect(Swal.fire).toHaveBeenCalledWith({
        title: title,
        text: message,
        icon: 'info',
        confirmButtonText: 'OK',
      });
    });
  });
});
