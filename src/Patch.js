import t from 'tcomb';

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
 * json patch set
 * - only add, remove and replace patches are supported
 * - http://jsonpatch.com
 * @typedef {Array<Patch>} PatchSet
 */
/**
 * json patch type.
 * - only add, remove and replace patches are supported
 * - http://jsonpatch.com
 * @typedef {object} Patch
 */
export const Patch = t.union([AddPatch, RemovePatch, ReplacePatch], 'Patch');
