import { Injectable } from '@angular/core';
import {
    Auth,
    signOut,
    signInWithPopup,
    user,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail,
    getAdditionalUserInfo,
    OAuthProvider,
    linkWithPopup,
    unlink,
    updateEmail,
    updatePassword,
    User,
    reauthenticateWithPopup,
    authState,
    onAuthStateChanged,
    UserCredential,
    GoogleAuthProvider,
    getIdTokenResult,
    IdTokenResult,
} from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { routesNames } from '../app-routing.module';
import { Alerts } from '../shared/alerts';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    currentUser!: User | null;
    token: IdTokenResult | null = null;

    constructor(
        private auth: Auth,
        private router: Router,
        public alerts: Alerts,
        public db: AngularFireDatabase
    ) {
        this.authStateChanged();
    }

    public async loginEmail(email: string, senha: string) {
        try {
            const credential = await signInWithEmailAndPassword(
                this.auth,
                email,
                senha
            );
            
            return true;
        } catch (err: any) {
            console.log(err);
            this.alerts.showErrorMessage(
                err?.message ?? err ?? 'Some strange error had happen'
            );
            return false;
        }
    }

    public async signUpEmail(email: string, senha: string) {
        try {
            const credential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                senha
            );

            await this.db.database.ref(`${credential.user.uid}/score`).set(0);
            
            return true;
        } catch (err: any) {
            console.log(err);
            this.alerts.showErrorMessage(
                err?.message ?? err ?? 'Some strange error had happen'
            );
            return false;
        }
    }


    public async logout() {
        return signOut(this.auth);
    }

    public async authStateChanged() {
        onAuthStateChanged(this.auth, (user) => {
            if (user?.uid) {
                this.currentUser = user;
                this.checkPermission();
                const ref = window.location.href;
                const path = window.location.pathname;
                const other = window.location.hash;
                if (
                    window.location.pathname === routesNames.DEFAULT ||
                    window.location.pathname.includes(routesNames.LOGIN)
                ) {
                    this.router.navigate([routesNames.BET]);
                }
            } else {
                this.currentUser = null;
                this.token = null;
            }
        });
    }

    public async checkPermission() {
        if (this.currentUser) {
            this.token = await getIdTokenResult(this.currentUser);
        }
    }
}
