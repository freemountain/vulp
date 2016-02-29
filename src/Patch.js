import t from 'tcomb';

import check from './utils/checkType';
import { box } from './state';
import JSONPointer from './JSONPointer';

const specificString = str => t.irreducible(`String: ${str}`, x => str === x);

const BasePatch = t.struct({
  path: t.String
});

const AddPatch = BasePatch.extend({
  op:    specificString('add'),
  value: t.Any
}, 'AddPatch');

const RemovePatch = BasePatch.extend({
  op: specificString('remove')
}, 'RemovePatch');

const ReplacePatch = BasePatch.extend({
  op:    specificString('replace'),
  value: t.Any
}, 'ReplacePatch');


/**
 * json patch type.
 * - only add, remove and replace patches are supported
 * - http://jsonpatch.com
 * @typedef {object} Patch
 */
export const Patch = t.union([AddPatch, RemovePatch, ReplacePatch], 'Patch');

/* eslint-disable consistent-return */
Patch.dispatch = function(x) {
  if(check(AddPatch, x)) return AddPatch;
  if(check(ReplacePatch, x)) return ReplacePatch;
  if(check(RemovePatch, x)) return RemovePatch;
};

export class PatchC {
  constructor(patch) {
    Patch(patch);
    Object.assign(this, patch);
    Object.freeze(this);
  }

  static of(patch) {
    return new PatchC(patch);
  }


  toJSON() {
    return {
      op:    this.op,
      path:  this.path,
      value: this.value
    };
  }

  normalize(transform) {
    if(this.op === 'remove') return this;

    const path = transform.apply(JSONPointer.ofString(this.path));
    const patch =  Object.assign({}, this, { path: path.toRFC() });

    return new PatchC(patch);
  }
}

window.Patch = PatchC;

/* eslint-enable consistent-return */

function createPatchJSON(obj) {
  // assert patch is ok, and return pojo
  Patch(obj);
  return {
    op:    obj.op,
    path:  obj.path,
    value: obj.value
  };
}

/**
 * replace patch shortcut
 * @param  {string} path - patch path
 * @param  {any} value - patch value
 * @return {Patch}
 */
export const $rep = (path, value) => createPatchJSON({
  op:    'replace',
  path,
  value: box(value)
});

/*
export const $rep = () => {
  throw new Error('nono');
};
*/

/**
 * add patch shortcut
 * @param  {string} path - patch path
 * @param  {any} value - patch value
 * @return {Patch}
 */
export const $add =  (path, value) => createPatchJSON({
  op:    'add',
  path,
  value: box(value)
});
