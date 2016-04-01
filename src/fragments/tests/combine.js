import chai from 'chai';
import things from 'chai-things';

import flyd from 'flyd';

import value from './../value';
import combine from './../combine';

chai.use(things);
const expect = chai.expect;

function collectPatches(fragment) {
  const history = [];

  flyd.on(x => x.map(y => history.push(y)), fragment);

  return () => history;
}

describe('combine fragment', function() {
  it('passes through first patchSet and dispatch all patchsets', function(done) {
    const input = flyd.stream();
    const foo = value();
    const bar = value();
    const c = combine({ foo, bar })(input);

    const collect = collectPatches(c);

    const patch = {
      path:  '',
      op:    'add',
      value: {
        foo: 'someFoo',
        bar: 'someBar'
      }
    };

    input([patch]);

    setTimeout(function() {
      const allPatches = collect();

      expect(allPatches.length).to.equal(3);
      expect(allPatches).to.include(patch);
      expect(allPatches).to.include({ op: 'add', path: '/foo', value: 'someFoo' });
      expect(allPatches).to.include({ op: 'add', path: '/bar', value: 'someBar' });
      expect(c.end.hasVal).to.equal(false);
      done();
    }, 10);
  });

  it('throws on patch with unkown root', function() {
    const input = flyd.stream();

    const c = combine({
      foo: value()
    })(input);

    input([{ path: '/bar', op: 'add', value: 0 }]);

    expect(c.end.hasVal).to.equal(true);
  });
});
