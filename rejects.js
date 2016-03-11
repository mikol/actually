(function (context) {
/*jscs:disable validateIndentation*//*jscs:enable validateIndentation*/
// -----------------------------------------------------------------------------

'use strict';

var id = 'rejects';
var dependencies = ['is', 'match'];

function factory(is, match) {
  /**
   * Asserts that `promise` is rejected and optionally guarantees that the
   * reason is an instance of `constructor` with a message matching `regexp`.
   *
   * @param {Promise} promise - The promise that should reject.
   * @param {Function=} [constructor] - The type of reason to expect.
   * @param {(RegExp|*)=} [regexp] - The pattern that the reason’s message is
   *     expected to match.
   *
   * @return {Promise<boolean>} A promise that resolves with: `true` if
   *     `promise` rejects with a reason meeting the the optional expectations
   *     for `constructor` and `regexp`; otherwise the promise will be rejected.
   */
  return function resolves(promise, constructor, regexp) {
    var n = arguments.length;

    return promise.then(function (value) {
      var error =
          new Error('Expected promise to reject, but it resolved as ${0}.');
      error.argv = [value, promise, constructor, regexp];
      throw error;
    }, function (reason) {
      if (n === 1) {
        return true;
      } else if (n === 2) {
        if (!is.function(constructor)) {
          regexp = constructor;
          constructor = undefined;
        }
      }

      var isInstance = false;
      if (is.def(constructor)) {
        isInstance = reason instanceof constructor;
      } else {
        isInstance = true;
      }

      var isMatch = false;
      if (is.def(regexp)) {
        isMatch = match(reason.message || reason, regexp);
      } else {
        isMatch = true;
      }

      var failure;
      if (n === 3) {
        if (!isInstance || !isMatch) {
          failure = new Error('Expected promise to reject with reason ' +
              '${1} ${2}, but caught ${3} ${4}.');
          failure.argv = [
            promise,
            constructor,
            regexp,
            reason.constructor,
            reason.message || reason
          ];
          throw failure;
        }
      } else if (isInstance && !isMatch) {
        failure = new Error('Expected promise to reject with reason ${1}, ' +
            'but caught ${2}.');
        failure.argv = [promise, regexp, reason.message || reason];
        throw failure;
      } else if (!isInstance && isMatch) {
        failure = new Error('Expected promise to reject with reason ${1}, ' +
            'but caught ${2}.');
        failure.argv = [promise, constructor, reason.constructor];
        throw failure;
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
