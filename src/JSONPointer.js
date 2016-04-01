import t from 'tcomb';


const unescape = str => str.replace(/~1/g, '/').replace(/~0/g, '~');
const escape = str => str.toString().replace(/~/g, '~0').replace(/\//g, '~1');

/**
 * An array of Strings
 * TokenList holds JSONPath tokens.
 * @private
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
    if(!t.String.is(str)) throw new Error('JSONPointer::ofString - expected string');

    // empty string is root poiner
    if(str === '') return new JSONPointer({
      tokens: []
    });

    if(str.charAt(0) !== '/') throw new TypeError(`Invalid JSONPointer '${str}'`);

    // pointer to key ""
    if(str === '/') return new JSONPointer({
      tokens: ['']
    });

    return new JSONPointer({
      tokens: str.slice(1).split('/').map(unescape)
    });
  }

  /**
   * get rfc string representation
   *
   * @returns {string}
   */
  toRFC() {
    return this.tokens.map(token => `/${escape(token)}`).join('');
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
    return escape(this.tokens[ 0 ] || '');
  }

  /**
   * get last token
   *
   * Return value is the last entry from token list.
   * @returns {string}
   */
  last() {
    return escape(this.tokens[ this.tokens.length - 1 ] || '');
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
