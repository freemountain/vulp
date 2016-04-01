import flyd from 'flyd';
import t from 'tcomb';

import JSONPointer from './../JSONPointer';

const stringifyPath = patch => Object.assign({}, patch, {
  path: patch.path.toRFC()
});

const parsePath = patch => Object.assign({}, patch, {
  path: JSONPointer.ofString(patch.path)
});

const prefixPath = prefix => patch => Object.assign({}, patch, {
  path: JSONPointer.ofString(`/${prefix}`).concat(patch.path)
});

const slicePath = patch => Object.assign({}, patch, {
  path: patch.path.slice(1)
});

const splitRootPatch = patch => Object.keys(patch.value).map(function(prop) {
  const value = patch.value[ prop ];
  const path = JSONPointer.ofString(`/${prop}`);
  const op = patch.op;

  return { value, path, op };
});

const displayPatch = patch => `Patch {
  path: ${t.String.is(patch.path) ? patch.path : patch.path.toRFC()},
  value: ${JSON.stringify(patch.value, null, '  ')},
  op: ${patch.op}
}`;

const filterPatch = prefix => patch => patch.path.first() === prefix;

const prefixInput = prefix => patchSet => patchSet
  .filter(filterPatch(prefix))
  .map(slicePath)
  .map(stringifyPath);

const prefixOutput = prefix => patchSet => patchSet
  .map(parsePath)
  .map(prefixPath(prefix))
  .map(stringifyPath);

function relativeComplement(ax, bx) {
  const a = t.Array.is(ax) ? new Set(ax) : ax;
  const b = t.Array.is(bx) ? new Set(bx) : bx;

  const c = new Set();

  a.forEach(function(x) {
    if(!b.has(x)) c.add(x);
  });

  return c;
}

function validateDeepPatch(validPrefix, patch) {
  if(!validPrefix.has(patch.path.first())) throw new TypeError(`PatchError: illegal path
    first token have to be one of these ${Array.from(validPrefix)}
    Patch: ${displayPatch(patch)}
  `);

  return patch;
}

function validateRootPatch(validPrefix, patch) {
  if(!t.Object.is(patch.value)) throw new TypeError(`PatchError:
      value, needs to be an object when patching root on combine fragment
      Patch: ${displayPatch(patch)}
  `);

  const prefix = Object.keys(patch.value);
  const illegal = relativeComplement(prefix, validPrefix);

  if(prefix.length > validPrefix.size || illegal.size > 0) throw new TypeError(`PatchError: illegal value
      value, needs the following properties ${Array.from(validPrefix)}
  `);

  return patch;
}

function validatePatch(validPrefix, patch) {
  const isDeep = patch.path.size() > 0;
  const validate = isDeep ? validateDeepPatch : validateRootPatch;

  return validate(validPrefix, patch);
}

function normalizePatch(patch) {
  const isDeep = patch.path.size() > 0;

  if(isDeep) return [patch];
  return splitRootPatch(patch);
}

function normalizePatchSet(validPrefix, patchSet) {
  return patchSet
    .map(parsePath)
    .map(patch => validatePatch(validPrefix, patch))
    .map(normalizePatch)
    .reduce((prev, curr) => prev.concat(curr), []);
}

function normalizePatchSetR(validPrefix, patchSet) {
  const result = {};

  try {
    result.value = normalizePatchSet(validPrefix, patchSet);
  } catch(e) {
    result.error = e;
  }

  return result;
}

function assemble(...steps) {
  return input => steps.reduce((current, step) => step(current), input);
}

function createDispatcher(inputMap) {
  const read = flyd.stream();
  const write = flyd.stream();
  const valid = Object.keys(inputMap);
  const inputs = valid.map(function(prefix) {
    const input = flyd.endsOn(write.end, flyd.stream());
    const output = assemble(
      flyd.map(prefixInput(prefix)),
      inputMap[ prefix ],
      flyd.map(prefixOutput(prefix))
    )(input);

    flyd.on(read, output);

    return input;
  });

  flyd.on(patchSet => inputs.forEach(input => input(patchSet)), write);

  return { read, write };
}

/**
 * combine fragment factory
 *
 * created fragment represents a JSON Object.
 * All recived patchsets will be dispatched to fragment properties.
 * The first recived patchset will be dispatched and passed through.
 *
 * @example
 * import flyd from 'flyd';
 * import vulp from 'vulp';
 * const delayedAdd = d => input => flyd.combine(function(read, write) {
 *   const current = read();
 *   const next = current.map(patch => Object.assign({}, patch, { value: patch.value + 1 }));
 *
 *   setTimeout(() => write(next), d);
 * }, [input]);
 *
 * const input = flyd.stream();
 *
 * const combined = vulp.fragments.combine({
 *   foo: vulp.fragments.value(),
 *   bar: delayedAdd(1000)
 * })(input);
 *
 * const value = {
 *   foo: 10,
 *   bar: 10
 * };
 *
 * flyd.on(x => console.log(x), combined);
 * input([ { op: 'add', path: '', value }]);
 * // console.log will be called three times
 * // console: [ { op: 'add', path: '', value: { foo: 10, bar: 10 } } ]
 * // console: [ { value: 10, path: '/foo', op: 'add' } ]
 * // console: [ { value: 11, path: '/bar', op: 'add' } ]
 *
 * @param {Map<String, BoundFragmentFactory>} map -  properties map
 * @return {BoundFragmentFactory}
 */
export default function combine(map) {
  return input => {
    let first = true;
    const validPrefixSet = new Set(Object.keys(map));
    const dispatcher = createDispatcher(map);

    const output = flyd.stream();
    const end = e => {
      if(e) console.log(e);
      output.end(e);
      dispatcher.write.end(true);
    };

    flyd.on(() => end(true), input.end);

    flyd.on(x => output(x), dispatcher.read);

    flyd.on(function(patchSet) {
      if(!first) return;
      first = false;
      output(patchSet);
    }, input);

    flyd.on(function(patchSet) {
      const normalizeResult = normalizePatchSetR(validPrefixSet, patchSet);

      if(normalizeResult.error) return end(normalizeResult.error);

      const normalized = normalizeResult.value;

      dispatcher.write(normalized);
      return null;
    }, input);


    return output;
  };
}
