import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { SnackService } from './snack.service';

describe('SnackService', () => {
  let service: SnackService;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: MatSnackBar, useValue: spy }]
    });

    matSnackBarSpy = TestBed.get<MatSnackBar>(MatSnackBar);

    service = TestBed.inject(SnackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a mat snackbar', () => {
    service.openWithMessage('Hello test', 'ok');

    expect(matSnackBarSpy.open).toHaveBeenCalled();
  });
});
