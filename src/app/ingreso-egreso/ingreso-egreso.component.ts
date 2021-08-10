import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingresoEgreso.model';
import { ingresoEgresoService } from '../services/ingresoEgreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  uiSubscription: Subscription;
 
  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: ingresoEgresoService,
    private store: Store<AppState>
  ) {
    this.uiSubscription = this.store.select('ui').subscribe(({isLoading}) => (this.cargando = isLoading));
  }

  ngOnInit() {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }
  guardar() {
    this.store.dispatch(ui.isLoading());
    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        Swal.fire('Registro creado', descripcion, 'success');
        this.store.dispatch(ui.stopLoading());
        this.ingresoForm.reset();
      })
      .catch((error) => Swal.fire('Error', error.message, 'error'));

    this.store.dispatch(ui.stopLoading());
  }
  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }
}
