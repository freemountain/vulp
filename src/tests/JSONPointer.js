import { expect } from 'chai';

import JSONPointer from './../JSONPointer';

const rfcTest = {
  '':         [],
  '/foo':     ['foo'],
  '/foo/0':   ['foo', '0'],
  '/bar':     ['bar'],
  '/bar/baz': ['bar', 'baz'],
  '/':        [''],
  '/a~1b':    ['a/b'],
  '/c%d':     ['c%d'],
  '/e^f':     ['e^f'],
  '/g|h':     ['g|h'],
  '/i\\j':    ['i\\j'],
  '/k\'l':    ['k\'l'],
  '/ ':       [' '],
  '/m~0n':    ['m~n']
};

describe('JSONPointer', function() {
  it('parse pointer string as described in rfc', function() {
    Object.keys(rfcTest).forEach(function(pointerStr) {
      const expected = rfcTest[ pointerStr ];
      const result = JSONPointer.ofString(pointerStr);

      expect(result.tokens).to.eql(expected);
    });
  });

  it('assemble pointer as described in rfc', function() {
    Object.keys(rfcTest).forEach(function(pointerStr) {
      const tokens = rfcTest[ pointerStr ];
      const pointer = JSONPointer.ofTokens(tokens);
      const result = pointer.toRFC();

      expect(result).to.eql(pointerStr);
    });
  });
});
