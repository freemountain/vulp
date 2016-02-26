import t from 'tcomb';
import mapObj from '@f/map-obj';

import JSONPointer from './JSONPointer';

function substitutePointer(pointer, targets) {
  const root = pointer.first();

  if(t.Nil.is(targets[ root ]))
    throw new Error(`No target found for key ${root}. Possible targets: ${targets.toString()}`);

  const tokens = targets[ root ].tokens.concat(pointer.tokens.slice(1));

  return JSONPointer.ofTokens(tokens);
}

/**
 * Map holds transform informations.
 *
 * @typedef {Map<string, JSONPointer>} Map
 */

const Map = t.dict(t.String, JSONPointer);

const parseTargets = desc => mapObj(JSONPointer.ofString, desc);


/**
 * Transform tracks changes to state structure,
 * is used for mounting transforms.
 */

class Transform {

  /**
   * Transform constructors
   *
   * @param {Map} map - instances sdds
   */

  constructor(map = Map({})) {
    this.length = Object.keys(map).length;
    this.map = map;

    Object.freeze(this.length);
    Object.freeze(this.map);
    Object.freeze(this);
  }

  /**
   * parse target keys to json pointer and return transform
   * @param {Object<string, string>} targets
   * @returns {Transform}
   */

  static ofTargets(targets = {}) {
    const map = parseTargets(targets);

    return new Transform(map);
  }

  /**
   * resolve keys from child transform with targets from object
   * @param {Transform} child - the child
   * @returns {Transform}
   */

  sub(child) {
    if(this.isIdentity()) return child;
    if(child.isIdentity()) return this;

    const childMap = mapObj(target => substitutePointer(target, this.map), child.map);

    return new Transform(childMap);
  }

  /**
   * apply transform on JSONPointer
   * @param {JSONPointer} pointer - pointer
   * @returns {Transform}
   */

  apply(pointer) {
    const target = pointer.first();

    if(t.Nil.is(this.map[ target ])) return pointer;

    const tail = pointer.slice(1);

    return this.map[ target ].concat(tail);
  }

  /**
   * returns targets (target pointer as rfc string)
   * @returns {Object<string, string>}
   */
  toTargets() {
    return mapObj(pointer => pointer.toRFC(), this.map);
  }

  /**
   * check if transforms are equal
   * @param {Transform} x - transfrom to check against
   * @returns {boolean}
   */
  equals(x) {
    if(this.length !== x.length) return false;

    return Object
      .keys(this.map)
      .every(target => x.map[ target ] && this.map[ target ].toRFC() === x.map[ target ].toRFC());
  }

  /**
   * check if transform is identify
   * @returns {boolean}
   */
  isIdentity() {
    return this.length === 0;
  }


}

export default Transform;
