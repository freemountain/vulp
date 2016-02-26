import t from 'tcomb';

import check from './utils/checkType';
import { box } from './state';

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
  if(check(RemovePatch, x)) return RemovePatch;
  if(check(ReplacePatch, x)) return ReplacePatch;
};

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
