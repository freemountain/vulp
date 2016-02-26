export default function(f, arity) {
  const length = Number.isInteger(arity) ? arity : f.length;

  function call(...args) {
    if(args.length >= length) return f.apply(this, args);
    return (...newArgs) => call(...args.concat(newArgs));
  }

  return call;
}
