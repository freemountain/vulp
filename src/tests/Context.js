import { expect } from 'chai';

import Context from './../Context';

describe('Context', function() {
  describe('#of', function() {
    it('creates Context', function() {
      const context = Context.ofState({
        counter: 1,
        label:   'huhu'
      });

      expect(context instanceof Context).to.equal(true);
      expect(context.state.get('counter')).to.equal(1);
      expect(context.state.get('label')).to.equal('huhu');
    });
  });

  describe('#get', function() {
    it('returns value', function() {
      const root = Context.ofState({
        foo: { bar: 1 },
        baz: 'huhu'
      });

      expect(root.get('/baz')).to.equal('huhu');
      expect(root.get('/foo/bar')).to.equal(1);
    });
  });

  describe('#changed', function() {
    it('empty', function() {
      const a = Context.ofState();
      const b = Context.ofState();
      const c = Context.ofState({ i: 4 });


      expect(a.changed(b)).to.equal(false);
      expect(a.changed(c)).to.equal(true);
    });

    it('changed state', function() {
      const a = Context.ofState({ i: 4 });
      const b = Context.ofState({ i: 5 });

      expect(a.changed(b)).to.equal(true);
    });
  });
});
