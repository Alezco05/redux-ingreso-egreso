import { createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingresoEgreso.model';
import { setItems, unSetItems } from './ingreso-egreso.actions';


export interface State {
  items: IngresoEgreso[];
}

export interface AppStateWithIngresoEgreso extends AppState {
  ingresoEgreso: IngresoEgresoState;
}

export interface IngresoEgresoState {
  items: IngresoEgreso[];
}




export const initialState: State = {
  items: [],
};

const _ingresoEgresoReducer = createReducer(
  initialState, 
  on( setItems,   (state, { items }) => ({ ...state, items: [...items]  })),
  on( unSetItems, state => ({ ...state, items: []  })),
);

export function ingresoEgresoReducer(state, action) {
  return _ingresoEgresoReducer(state, action);
}
export function AppStateWithIngresoEgreso(AppStateWithIngresoEgreso: any) {
  throw new Error('Function not implemented.');
}

