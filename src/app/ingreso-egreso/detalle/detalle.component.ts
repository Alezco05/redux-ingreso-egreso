import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingresoEgreso.model';
import { ingresoEgresoService } from 'src/app/services/ingresoEgreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];
  sub: Subscription;
  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: ingresoEgresoService
  ) {}

  ngOnInit() {
    this.sub = this.store.select('ingresosEgresos').subscribe(({ items }) => {
      this.ingresosEgresos = items;
    });
  }
  borrar(item: IngresoEgreso) {
    const { uid } = item;
    this.ingresoEgresoService
      .borrarIngresoEgreso(uid)
      .then(() => Swal.fire('Borrado', item.description, 'success'))
      .catch((error) => Swal.fire('Error', item.description, 'error'));
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
