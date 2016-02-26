import t from 'tcomb';
import Immutable from 'immutable';
import applyPatch from 'immpatch';

import Transform from './Transform';
import JSONPointer from './JSONPointer';
import { get, unbox, box } from './state';

function applyTransform(transform, state) {
  const newState = Immutable.Map(transform.map)
    .map(pointer => get(state, pointer));

  return newState;
}

const emptyInstance = {
  type:      t.Any,
  state:     box({}),
  transform: Transform.ofTargets({})
};

/**
 * Context is passed to all components.
 */
class Context {

  /**
   * Context constructors
   *
   * @param {Object} instance - instances sdds
   * @param {Object} instance.state - states  sd
   * @param {Transform} instance.transform - transform sdds
   */
  constructor(instance = {}) {
    Object.assign(this, emptyInstance, instance);

    Object.freeze(this);
  }


  /**
   * create Context of state, transform is identity
   * @param  {object} state - state of ctx
   * @return {Context}
   */

  static ofState(state = {}) {
    return new Context({
      state:     box(state),
      transform: Transform.ofTargets({})
    });
  }

  /**
   * get value from state
   * @param {string|JSONPointer} path = '' - pointer to value
   * @param {boolean} toJS = false - unbox value?
   * @return {any} value
   */
  get(path = '', toJS = false) {
    if(t.Boolean.is(path)) return this.get('', path);

    const result = get(this.state, JSONPointer.ofString(path));

    return toJS ? unbox(result) : result;
  }

  /**
   * transform ctx with target sub
   * @param  {Transform} sub [description]
   * @return {Context}
   */
  sub(sub) {
    const transform = this.transform.sub(sub);
    const state = applyTransform(sub, this.state);

    return new Context({ transform, state });
  }

  /**
   * check if ctx has  changed
   * @param  {Context} last - the last COntext
   * @return {boolean}
   */
  changed(last) {
    const keys = last.state.keySeq().toJS();

    if(!this.transform.equals(last.transform)) return true;
    return keys.some(key => this.get(key) !== last.get(key));
  }

  update(patchSet) {
    if(!this.transform.isIdentity())
      console.log('WARNING: Context.update, this.transform should be identity');

    if(patchSet.length === 0) return this;

    const newState = applyPatch(this.state, patchSet);
    // assert type

    const rawState = newState.toJS();

    this.type(rawState);

    return new Context({
      type:      this.type,
      transform: this.transform,
      state:     newState
    });
  }


}

export default Context;
