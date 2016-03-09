import t from 'tcomb';

import { box } from './../state';
import JSONPointer from './../JSONPointer';

function toPatch(path, rawValue) {
  const op = JSONPointer.ofString(path).last() === '-' ? 'add' : 'replace';
  const value = box(rawValue);

  return {
    op,
    path,
    value
  };
}

export default function handler(context, pairs) {
  return pairs.map(function([path, value]) {
    if(!t.Function.is(value)) return toPatch(path, value);

    const currentValue = context.get(path, true);
    const nextValue = value(currentValue);

    return toPatch(path, nextValue);
  });
}
