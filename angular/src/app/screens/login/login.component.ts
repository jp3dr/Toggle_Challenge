import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    HostListener,
    NgZone,
    Output,
    EventEmitter,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { AuthService } from 'src/app/repository/authRepository';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css'],
})
export class Login implements OnInit {
    Email = '';
    Password = '';
    IsLoading = true;
    InvalidOnce = false;

    usuario: any = null;

    @Output() onLogin = new EventEmitter();

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (
            event.key === 'Enter' &&
            this.Email.length > 0 &&
            this.Password.length > 0
        ) {
            this.emailLogin();
        }
    }

    // tslint:disable-next-line: variable-name
    constructor(
        private auth: AuthService,
        public dialog: MatDialog,
        private router: Router,
        private ngZone: NgZone
    ) {
        const caso = window.location.search;
    }

    ngOnInit() {
        if (this.auth?.currentUser?.uid) {
            this.router.navigate(['']);
        } else {
            this.IsLoading = false;
        }
    }

    async emailLogin(): Promise<void> {
        this.IsLoading = true;
        this.Email = this.Email.replace(' ', '');

        try {
            const loginResponse = await this.auth.loginEmail(this.Email, this.Password);
            this.onLogin.emit(loginResponse);
        } catch (error: any) {
            console.error(error);
        }
        this.IsLoading = false;
        return;
    }

    async emailSignUp(): Promise<void> {
        this.IsLoading = true;
        this.Email = this.Email.replace(' ', '');

        try {
            const loginResponse = await this.auth.signUpEmail(this.Email, this.Password);
            this.onLogin.emit(loginResponse);
        } catch (error: any) {
            console.error(error);
        }
        this.IsLoading = false;
        return;
    }


    EmailTyped(value: string) {
        this.Email = value;
        return;
    }

    PasswordTyped(value: string) {
        this.Password = value;
        return;
    }
}
