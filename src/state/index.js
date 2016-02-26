import t from 'tcomb';
import Immutable from 'immutable';

export const is = {
  Irreducible: x => t.String.is(x) || t.Number.is(x) || t.Boolean.is(x) || t.Nil.is(x),
  Object:      x => t.Object.is(x),
  Array:       x => t.Array.is(x),
  Map:         x => Immutable.Map.isMap(x),
  List:        x => Immutable.List.isList(x)
};

export function box(val) {
  if(is.Irreducible(val)) return val;
  if(is.Array(val)) return Immutable.List(val).map(e => box(e));
  if(is.Object(val)) return Immutable.Map(val).map(e => box(e));

  throw new Error('Value is Function...');
}

export function unbox(state) {
  if(is.Map(state) || is.List(state)) return state.map(e => unbox(e)).toJS();
  return state;
}

export function get(state, pointer, notFound = null) {
  if(pointer.size() === 0) return state;

  if(is.Irreducible(state)) return notFound;

  const nextState = state.get(pointer.first(), notFound);
  const nextPointer = pointer.slice(1);

  return get(nextState, nextPointer, notFound);
}
