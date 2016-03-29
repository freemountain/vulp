import chai from 'chai';
import things from 'chai-things';
import decache from 'decache';

import flyd from 'flyd';

import value from './../value';
import combiner from './../combiner';

chai.use(things);
const expect = chai.expect;

function collectPatches(fragment) {
  const history = [];

  flyd.on(x => x.map(y => history.push(y)), fragment);

  return () => history;
}

const createPatch = (path, val) => ({
  op:    'add',
  path:  path,
  value: val
});

describe('combiner fragment', function() {
  afterEach(function() {
    decache('flyd');
  });

  it('aaa', function(done) {
    const input = flyd.stream();
    const foo = value();
    const bar = value();
    const c = combiner({ foo, bar })(input);

    const collect = collectPatches(c);
    const first = createPatch('/foo', 'someFoo');
    const second = createPatch('/bar', 'someBar');

    input([first, second]);

    setTimeout(function() {
      const allPatches = collect();

      expect(allPatches.length).to.equal(2);
      expect(allPatches).to.include(first);
      expect(allPatches).to.include(second);
      expect(c.end.hasVal).to.equal(false);

      done();
    }, 10);
  });


  it('throws on patch with unkown root', function() {
    const input = flyd.stream();

    const c = combiner({
      foo: value()
    })(input);

    input([createPatch('/bar', 0)]);

    expect(c.end.hasVal).to.equal(true);
  });
});
