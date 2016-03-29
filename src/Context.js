import t from 'tcomb';
import applyPatch from 'immpatch';

import JSONPointer from './JSONPointer';
import { get, unbox, box } from './state';

const emptyInstance = {
  type:  t.Any,
  state: box({})
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
      state: box(state)
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

    t.String(path);

    const normalized = path.length > 0 && path.charAt(0) !== '/' ? `/${path}` : path;
    const result = get(this.state, JSONPointer.ofString(normalized));

    return toJS ? unbox(result) : result;
  }

  /**
   * check if ctx has  changed
   * @param  {Context} last - the last COntext
   * @return {boolean}
   */
  changed(last) {
    const keys = last.state.keySeq().toJS();

    return keys.some(key => this.get(key) !== last.get(key));
  }

  update(patchSet) {
    if(patchSet.length === 0) return this;

    const boxedPatchSet = patchSet.map(patch => Object.assign({}, patch, { value: box(patch.value) }));
    const newState = applyPatch(this.state, boxedPatchSet);
    // assert type

    const rawState = newState.toJS();

    this.type(rawState);

    return new Context({
      type:  this.type,
      // transform: this.transform,
      state: newState
    });
  }


}

export default Context;
