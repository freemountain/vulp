import t from 'tcomb';

/**
 * An array of Strings
 * TokenList holds JSONPath tokens.
 * @typedef {Array<string>} TokenList
 */
const TokenList = t.list(t.String);

/**
 * 	JSON Pointer defines a string format for identifying a specific value within a JSON document.
 *  This class holds methods for manipulation of pointers.
 *
 *  For more information:
 *   - http://tools.ietf.org/html/rfc6901
 *   - http://jsonpatch.com/#json-pointer
 */
class JSONPointer {

  /**
   * JSONPointer constructors
   *
   * @param {Object} opts - options.
   * @param {TokenList} opts.tokens - json path tokens
   */
  constructor(opts = {}) {
    const tokens = TokenList(opts.tokens || []);

    this.tokens = tokens;

    Object.freeze(this.tokens);
    Object.freeze(this);
  }

  static ofTokens(tokens) {
    return new JSONPointer({ tokens });
  }

  /**
   * parse str and return JSONPointer
   *
   * If x starts with '/' create will treat x as a JSONPointer.
   * All other string will be treated like immutable js pointer (eg.: 'foo.bar')
   *
   * @param {string} str - pointer string
   * @returns {JSONPointer}
   */
  static ofString(str) {
    if(!t.String.is(str))
      throw new Error('JSONPointer::ofString - expected string');

    if(str === '') return new JSONPointer({
      tokens: []
    });

    // pointer to key "" (rfc)
    if(str === '/') return new JSONPointer({
      tokens: ['']
    });

    if(str.startsWith('/')) return new JSONPointer({
      tokens: str.split('/').slice(1)
    });

    return new JSONPointer({
      tokens: str.split('.')
    });
  }

  /**
   * get rfc string representation
   *
   * @returns {string}
   */
  toRFC() {
    return '/'.concat(this.tokens.join('/'));
  }

  /**
   * get immutable js string representation
   *
   * @returns {string}
   */
  toImmutable() {
    return this.tokens.join('.');
  }

  /**
   * get first token
   *
   * Return value is the first entry from token list.
   * @returns {string}
   */
  first() {
    return this.tokens[ 0 ] || null;
  }

  /**
   * return length of token array
   * @returns {number}
   */
  size() {
    return this.tokens.length;
  }

  /**
   * concat two JSONPointer
   *
   * @param {JSONPointer} sub - the pointer to concat
   * @returns {JSONPointer}
   */
  concat(sub) {
    if(!sub instanceof JSONPointer)
      throw new Error('JSONPointer#concat argument should be JSONPointer');

    return new JSONPointer({
      tokens: this.tokens.concat(sub.tokens)
    });
  }

  /**
   * slice JSONPointer
   *
   * slice has the same signature like Array.prototype.slice.
   *
   * @returns {JSONPointer}
   */
  slice() {
    return new JSONPointer({
      tokens: Array.prototype.slice.apply(this.tokens, arguments)
    });
  }
}

export default JSONPointer;
