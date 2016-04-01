import { expect } from 'chai';

import JSONPointer from './../../JSONPointer';
import { box, unbox, get } from './../state';

describe('state', function() {
  describe('box', function() {
    it('boxes Objects', function() {
      const value = { foo: { bar: 'baz' } };
      const state = box(value);

      expect(state.get('foo').get('bar')).to.equal('baz');
    });

    it('boxes Array', function() {
      const value = [1, [10, 11]];
      const state = box(value);

      expect(state.get(0)).to.equal(1);
      expect(state.get(1).get(0)).to.equal(10);
    });
  });

  it('#unbox', function() {
    const unboxed = {
      dict: { foo: 1 },
      list: [0, 1]
    };
    const state = box(unboxed);
    const value = unbox(state);

    expect(value.dict.foo).to.equal(1);
    expect(value.list[ 0 ]).to.equal(0);
  });


  it('#get', function() {
    const state = box({
      dict: { foo: 1 },
      list: [0, 1]
    });
    const pointerFoo = JSONPointer.ofString('/dict/foo');
    const pointer = JSONPointer.ofString('/list/0');

    expect(get(state, pointerFoo)).to.equal(1);
    expect(get(state, pointer)).to.equal(0);
  });
});
