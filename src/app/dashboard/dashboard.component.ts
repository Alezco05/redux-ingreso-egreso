import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { ingresoEgresoService } from '../services/ingresoEgreso.service';
import { setItems } from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  constructor(private store: Store<AppState>, private ingresoEgresoService: ingresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
    .pipe(filter(x => x.user != null))
    .subscribe(({user}) => this.ingresoEgresoService.initIngresosEgresosListener(user.uid).subscribe(
      items => this.store.dispatch(setItems({items}))
    ));

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
