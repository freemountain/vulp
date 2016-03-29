import flyd from 'flyd';
import t from 'tcomb';

import JSONPointer from './../JSONPointer';
// import firstCache from './../utils/firstCache';

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

const filterPatch = prefix => patch => patch.path.first() === prefix;

function prefixFragment(prefix, input, fragment) {
  const mappedInput = flyd.combine(function(i) {
    const patchSet = i();

    return patchSet
      .filter(filterPatch(prefix))
      .map(slicePath)
      .map(stringifyPath);
  }, [input]);

  return flyd.map(function(patchSet) {
    return patchSet
      .map(parsePath)
      .map(prefixPath(prefix))
      .map(stringifyPath);
  }, fragment(mappedInput));
}

function normalizePatch(patch) {
  if(patch.path.size() > 0) return [patch];

  if(!t.Object.is(patch.value)) throw new TypeError(`combiner fragment recived root patch with non object!
    Patch: {
      path: ${patch.path.toRFC()},
      value: ${JSON.stringify(patch.value, null, '  ')},
      op: ${patch.op}
    }`);


  return Object.keys(patch.value).map(function(prop) {
    const value = patch.value[ prop ];
    const path = JSONPointer.ofString(`/${prop}`);
    const op = patch.op;

    return { value, path, op };
  });
}

/* eslint-disable max-statements */
function mapInput(input, validPrefixSet) {
  return flyd.combine(function(i, output) {
    const current = i();

    if(t.Nil.is(current)) return;

    const patchSet = current
      .map(parsePath)
      .map(normalizePatch)
      .reduce((prev, cur) => prev.concat(cur), []);

    const currentPrefixSet = new Set(patchSet.map(patch => patch.path.first()));
    const invalid = [];

    currentPrefixSet.forEach(function(prefix) {
      if(validPrefixSet.has(prefix)) return;
      invalid.push(prefix);
    });

    if(invalid.length === 0) {
      output(patchSet);
      return;
    }

    output.end(new Error(`combine error: invalid prefix: ${invalid.join(', ')}`));
  }, [input]);
}

const combine = map => function(input) {
  const prefix = Object.keys(map);
  const prefixSet = new Set(prefix);
  const fragments = prefix.map(name => map[ name ]);
  const mappedInput = mapInput(input, prefixSet);

  const prefixed =  fragments.map((f, i) => prefixFragment(prefix[ i ], mappedInput, f));

  return flyd.combine(function(...args) {
    const changed = args[ args.length - 1 ];

    return changed.reduce((prev, current) => prev.concat(current()), []);
  }, prefixed);
};

export default combine;
