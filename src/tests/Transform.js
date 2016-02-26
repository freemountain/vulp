import { expect } from 'chai';

import Transform from './../Transform';
import JSONPointer from './../JSONPointer';

// const createCheck = (T, value) => () => T(value);

describe('Transform', function() {
  describe('#create', function() {
    it('creates Transform', function() {
      const transform = Transform.ofTargets({ foo: '/bar' });

      expect(transform instanceof Transform).to.equal(true);
      expect(transform.isIdentity()).to.equal(false);
    });

    it('empty call creates identity', function() {
      const transform = Transform.ofTargets();

      expect(transform instanceof Transform).to.equal(true);
      expect(transform.isIdentity()).to.equal(true);
    });
  });

  describe('#sub', function() {
    it('sub returns Transform', function() {
      const rootTransform = Transform.ofTargets({
        a: '/foo/aaa',
        b: '/bar/bbb'
      });

      const subTransform = Transform.ofTargets({
        foo: '/a',
        bar: '/b/someVal'
      });

      const result = rootTransform.sub(subTransform);
      const targets = result.toTargets();

      expect(result instanceof Transform).to.equal(true);
      expect(targets.foo).to.equal('/foo/aaa');
      expect(targets.bar).to.equal('/bar/bbb/someVal');
    });
  });

  describe('#equals', function() {
    it('s', function() {
      const map = {
        foo: '/bar'
      };
      const a = Transform.ofTargets(map);
      const b = Transform.ofTargets(map);
      const c = Transform.ofTargets({
        foo: '/someotherprop'
      });

      expect(a.equals(b)).to.equal(true);
      expect(a.equals(c)).to.equal(false);
    });
  });

  describe('#apply', function() {
    it('applies transform on pointer', function() {
      const transform = Transform.ofTargets({
        foo: '/aaa/bbb',
        bar: '/ccc'
      });

      const fooPointer = JSONPointer.ofString('/foo/xxx');
      const barPointer = JSONPointer.ofString('/bar/yyy');

      const fooTransformed = transform.apply(fooPointer).toRFC();
      const barTransformed = transform.apply(barPointer).toRFC();

      expect(fooTransformed).to.equal('/aaa/bbb/xxx');
      expect(barTransformed).to.equal('/ccc/yyy');
    });
  });
});
