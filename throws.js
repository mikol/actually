(function (context) {
/*jscs:disable validateIndentation*//*jscs:enable validateIndentation*/
// -----------------------------------------------------------------------------

'use strict';

var id = 'throws';
var dependencies = ['is', 'matches'];

function factory(is, matches) {
  /**
   * Asserts that `fn()` throws an exception and optionally guarantees that the
   * exception is an instance of `constructor` with a message matching `regexp`.
   *
   * @param {Function=} [constructor] - The type of exception to expect.
   * @param {(RegExp|*)=} [regexp] - The pattern that the exception’s message is
   *     expected to match.
   * @param {Function} fn - The function to invoke.
   *
   * @return {!boolean} `true` if `fn()` throws an exception meeting the
   *     the optional expectations for `constructor` and `regexp`.
   *
   * @throws {Error} If `fn()` doesn’t throw an exception or the exception
   *     thrown doesn’t meet the expectations for `constructor` and `regexp`.
   */
  return function throws(constructor, regexp, fn) {
    var n = arguments.length;
    if (n === 1) {
      fn = constructor;
      constructor = undefined;
    } else if (n === 2) {
      fn = regexp;
      if (is.function(constructor)) {
        regexp = undefined;
      } else {
        regexp = constructor;
        constructor = undefined;
      }
    }

    var error;
    try {
      fn();
    } catch (e) {
      error = e;
    }

    if (is.nil(error)) {
      error = new Error('Expected ${0} to throw an exception.');
      error.argv = [fn];
      throw error;
    }

    if (n === 1) {
      return true;
    }

    var isInstance = false;
    if (is.def(constructor)) {
      isInstance = error instanceof constructor;
    } else {
      isInstance = true;
    }

    var isMatch = false;
    if (is.def(regexp)) {
      isMatch = matches(regexp, error.message || error);
    } else {
      isMatch = true;
    }

    var failure;
    if (n === 3) {
      if (!isInstance || !isMatch) {
        failure =
          new Error('Expected ${0} to throw ${1} ${2}, but caught ${3} ${4}.');
        failure.argv = [
          fn,
          constructor,
          regexp,
          error.constructor,
          error.message || error
        ];
        throw failure;
      }
    } else if (isInstance && !isMatch) {
      failure = new Error('Expected ${0} to throw ${1}, but caught ${2}.');
      failure.argv = [fn, regexp, error.message || error];
      throw failure;
    } else if (!isInstance && isMatch) {
      failure = new Error('Expected ${0} to throw ${1}, but caught ${2}.');
      failure.argv = [fn, constructor, error.constructor];
      throw failure;
    }

    return true;
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
