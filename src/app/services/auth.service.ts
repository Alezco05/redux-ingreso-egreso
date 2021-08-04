import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  subscription: Subscription;
  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fuser) => {
      if (fuser) {
        this.subscription = this.firestore
          .doc(`${fuser.uid}/usuario`)
          .valueChanges()
          .subscribe((fireStoreUser: any) => {
            const user = Usuario.fromFirebase(fireStoreUser);
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        this.subscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    // console.log({ nombre, email, password });
    return new Promise((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(email, password).then(
        (data) => {
          resolve(data);
          const { user } = data;
          const newUser = new Usuario(user.uid, nombre, user.email);
          return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });
        },
        (error) => reject(error)
      );
    });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map((fbUser) => fbUser != null));
  }
}
