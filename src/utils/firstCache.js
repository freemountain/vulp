import flyd from 'flyd';
import t from 'tcomb';

export default function firstCache(input) {
  let hold = true;
  let cache = [];

  const output = flyd.combine(function(i, out) {
    const currentVal = i();

    if(t.Nil.is(currentVal)) return;
    if(!hold) {
      out(currentVal);
      return;
    }

    currentVal.forEach(patch => cache.push(patch));
  }, [input]);

  output.release = function() {
    hold = false;
    if(cache.length > 0) output(cache);
    cache = [];
  };

  return output;
}
