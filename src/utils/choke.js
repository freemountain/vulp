/**
 * creates a choke that throttle fuction calls
 *
 * The returned choke function will throttle calls with the same path argument
 * for delta milliseconds.
 *
 * @param  {Number} delta - the delta between calls [ms]
 * @return {function(path: String, f: Function)}
 */

export default function choke(delta) {
  const cache = {};

  function call(path, f) {
    const lastTime = cache[ path ];
    const currentTime = Date.now();

    if(lastTime && currentTime - lastTime < delta) return;

    cache[ path ] = Date.now();
    f();
  }

  return call;
}
