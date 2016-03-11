(function (context) {
/*jscs:disable validateIndentation*//*jscs:enable validateIndentation*/
// -----------------------------------------------------------------------------

'use strict';

var id = 'resolves';
var dependencies = ['is'];

function factory(is) {
  /**
   * Asserts that `promise` resolves and optionally guarantees that the resolved
   * value is verified when `predicate()` is invoked with `argv`. The resolved
   * value is always *prepended* to `argv` (if `argv` is not defined, it will
   * default to an array with one element for the resolved value).
   *
   * @param {Promise} promise - The promise that should resolve.
   * @param {Array.<*>=} [argv=[value]] - Arguments to apply to `predicate()`.
   * @param {Function=} [predicate] - A function that asserts something about
   *     `promise`’s resolved value and the arguments in `argv`. `predicate()`
   *     can expect any number of arguments (including none at all) and should
   *     return `true` if what it asserts is verified; it should return `false`
   *     or throw an exception otherwise.
   *
   * @return {Promise<boolean>} A promise that resolves to `true` if `promise`
   *     resolves and, if the optional `predicate()` returns `true`; otherwise
   *     it resolves to `false` or rejects.
   */
  return function resolves(promise, argv, predicate) {
    if (is.nil(predicate)) {
      predicate = argv;
      argv = [];
    }

    return promise.then(function (value) {
      if (is.function(predicate)) {
        return predicate.apply(undefined, [value].concat(argv));
      }

      return true;
    });
  };
}

// -----------------------------------------------------------------------------
var n = dependencies.length;
var o = 'object';
var r = /([^-_\s])[-_\s]+([^-_\s])/g;
function s(m, a, b) { return a + b.toUpperCase(); }
context = typeof global === o ? global : typeof window === o ? window : context;
if (typeof define === 'function' && define.amd) {
  define(dependencies, function () {
    return factory.apply(context, [].slice.call(arguments));
  });
} else if (typeof module === o && module.exports) {
  for (; n--;) {dependencies[n] = require(dependencies[n]);}
  module.exports = factory.apply(context, dependencies);
} else {
  for (; n--;) {dependencies[n] = context[dependencies[n]];}
  context[id.replace(r, s)] = factory.apply(context, dependencies);
}
}(this));
