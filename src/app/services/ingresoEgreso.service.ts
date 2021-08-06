import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';

import { IngresoEgreso } from '../models/ingresoEgreso.model'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ingresoEgresoService {
  subscription: Subscription;
  constructor(
    private firestore: AngularFirestore,
    private store: Store<AppState>,
    private authService: AuthService
  ) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
      const {uid} = this.authService.user;
      return this.firestore.doc(`${uid}/ingresos-egresos`)
                    .collection('items')
                    .add({...ingresoEgreso});

  }
}
