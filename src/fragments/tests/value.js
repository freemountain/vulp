import { expect } from 'chai';
import flyd from 'flyd';

import value from './../value';

describe('value fragment', function() {
  it('has init value', function() {
    const input = flyd.stream();
    const val = value()(input);

    expect(val.end.hasVal).to.equal(false);
    expect(val.hasVal).to.equal(false);
  });

  it('like an identity stream', function(done) {
    const input = flyd.stream();
    const val = value()(input);
    const patchSet = [{
      value: 'foo',
      path:  '/some/prop',
      op:    'add'
    }];

    flyd.on(function(x) {
      expect(x).to.eql(patchSet);
      expect(val.end.hasVal).to.equal(false);

      done();
    }, val);

    val(patchSet);
  });
});
