import {  Injectable, NgZone } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class Alerts {
  config = new MatSnackBarConfig();

  constructor(private snackBar: MatSnackBar, private ngZone: NgZone) {
    this.config.verticalPosition = 'bottom';
    this.config.horizontalPosition = 'right';
    this.config.duration = 13000;
  }

  showErrorMessage(message: string, action?: any) {
    this.config.panelClass = ['error-snackbar'];
    this.ngZone.run(() => {
      this.snackBar.open(message, action ?? 'X', this.config);
    });
  }

  showAlertMessage(message: string, action?: any) {}

  showBasicMessage(message: string, action?: any) {
    this.config.panelClass = ['basic-snackbar'];
    this.ngZone.run(() => {
      this.snackBar.open(message, action ?? 'X', this.config);
    });
    return;
  }

  showDeleteConfirmation(
    message?: string,
    horizontalPosition?: MatSnackBarHorizontalPosition,
    // tslint:disable-next-line: align
    verticalPosition?: MatSnackBarVerticalPosition
  ) {
    this.config.verticalPosition = verticalPosition ?? 'top';
    this.config.horizontalPosition = horizontalPosition ?? 'right';
    this.config.panelClass = ['error-snackbar'];
    this.ngZone.run(() => {
      this.snackBar.open(
        message ?? 'Tem certeza que deseja deletar?',
        'Sim',
        this.config
      );
    });
    return;
  }

  showBasicConfirmation(
    message?: string,
    horizontalPosition?: MatSnackBarHorizontalPosition,
    verticalPosition?: MatSnackBarVerticalPosition,
    buttonMessage?: string
  ) {
    this.config.verticalPosition = verticalPosition ?? 'top';
    this.config.horizontalPosition = horizontalPosition ?? 'right';
    this.config.panelClass = ['basic-snackbar'];
    this.ngZone.run(() => {
      this.snackBar.open(
        message ?? 'Confirma?',
        buttonMessage ?? `SIM`,
        this.config
      );
    });
    return;
  }
}
