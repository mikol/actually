(function (context) {
/*jscs:disable validateIndentation*//*jscs:enable validateIndentation*/
// -----------------------------------------------------------------------------

'use strict';

var id = '';
var dependencies = ['criteria', '../prove', '../throws'];

function factory($0, prove, throws) {
  /* globals scope, test */
  scope('`prove` Assertion Tests',
  function () {
    test('Passes.', function () {
      prove([true, true], function (a, b) {
        return a === b;
      });
    });

    test('Fails.', function () {
      function f() {
        prove([true, false], function (a, b) {
          return a === b;
        });
      }

      prove([f], throws);
    });

    test('Fails with custom message.', function () {
      function f() {
        prove([true, false], function (a, b) {
          return a === b || new Error('${0} does not equal ${1}.');
        });
      }

      prove([f, Error, /does not equal/], throws);
    });

    test('Fails with custom arguments.', function () {
      function f() {
        prove([true, false], function (a, b) {
          var output = a === b || new Error('${0} did not equal ${1} at ${2}.');

          if (output !== true) {
            output.argv = [a, b, new Date()];
          }

          return output;
        });
      }

      prove([f, Error, /did not equal \S+ at/], throws);
    });

    test('Manually fails.', function () {
      function f() {
        prove(['`f()` should not have been called.'], Error);
      }

      prove([f, Error, '`f()` should not have been called.'], throws);
    });
  });
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
