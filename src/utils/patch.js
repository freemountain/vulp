import t from 'tcomb';

export function patch(...args) {
  if(args.length % 2 !== 0) throw new Error('length of arguments must be even');

  const pairs = args.reduce(function(current, e, i) {
    if(i % 2 === 0) current.push([]);
    current[ current.length - 1 ].push(e);

    return current;
  }, []);

  const patchSet = pairs.map(pair => ({
    op:    'replace',
    path:  pair[ 0 ],
    value: pair[ 1 ]
  }));

  return patchSet;
}

const toPatch = (path, value) => ({
  op: 'replace',
  path,
  value
});

export default function handler(...args) {
  if(args.length % 2 !== 0) throw new Error('length of arguments must be even');

  const pairs = args.reduce(function(current, e, i) {
    if(i % 2 === 0) current.push([]);
    current[ current.length - 1 ].push(e);

    return current;
  }, []);

  return (_, { context }) => pairs.map(function([path, value]) {
    if(!t.Function.is(value)) return toPatch(path, value);

    const currentValue = context.get(path, true);
    const nextValue = value(currentValue);

    return toPatch(path, nextValue);
  });
}
