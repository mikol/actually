(function (context) {
/*jscs:disable validateIndentation*//*jscs:enable validateIndentation*/
// -----------------------------------------------------------------------------

'use strict';

var id = '';
var dependencies =
    ['criteria', 'match', '../prove', '../rejects', '../resolves', '../throws'];

function factory($0, match, prove, rejects, resolves, throws) {
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

    test('Generic arrow predicate fails.', function () {
      function f() {
        prove([], () => false);
      }

      prove([f, '() => false'], throws);
    });

    test('Generic arrow predicate with argument fails.', function () {
      function f() {
        prove(['a'], () => false);
      }

      prove([f, "('a') => false"], throws);
    });

    test('Generic arrow predicate with arguments fails.', function () {
      function f() {
        prove(['a', 'b'], () => false);
      }

      prove([f, "('a', 'b') => false"], throws);
    });

    test('Generic arrow predicate with parameter fails.', function () {
      function f() {
        prove(['a'], (a) => a !== a);
      }

      prove([f, "(a = 'a') => a !== a"], throws);
    });

    test('Generic arrow predicate with some parameters fails.', function () {
      function f() {
        prove(['a', 'b'], (a) => a !== a);
      }

      prove([f, "(a = 'a', 'b') => a !== a"], throws);
    });

    test('Generic arrow predicate with parameters fails.', function () {
      function f() {
        prove(['a', 'b'], (a, b) => a === b);
      }

      prove([f, "(a = 'a', b = 'b') => a === b"], throws);
    });

    test('Generic predicate fails.', function () {
      function f() {
        prove([], function () {
          return false;
        });
      }

      prove([f, 'function () { return false; }'], throws);
    });

    test('Generic predicate with arguments fails.', function () {
      function f() {
        prove(['a', 'b'], function () {
          return false;
        });
      }

      prove([f, "function ('a', 'b') { return false; }"], throws);
    });

    test('Generic predicate with some parameters fails.', function () {
      function f() {
        prove(['a', 'b'], function (a) {
          return a !== a;
        });
      }

      prove([f, "function (a = 'a', 'b') { return a !== a; }"], throws);
    });

    test('Generic predicate with parameters fails.', function () {
      function f() {
        prove(['a', 'b'], function (a, b) {
          return a === b;
        });
      }

      prove([f, "function (a = 'a', b = 'b') { return a === b; }"], throws);
    });

    test('Generic named predicate fails.', function () {
      function f() {
        prove([], function predicate() {
          return false;
        });
      }

      prove([f, 'predicate();'], throws);
    });

    test('Generic named predicate with arguments fails.', function () {
      function f() {
        prove(['a', 'b'], function predicate() {
          return false;
        });
      }

      prove([f, "predicate('a', 'b');"], throws);
    });

    test('Generic named predicate with some parameters fails.', function () {
      function f() {
        prove(['a', 'b'], function predicate(a) {
          return a !== a;
        });
      }

      prove([f, "predicate(a = 'a', 'b');"], throws);
    });

    test('Generic named predicate with parameters fails.', function () {
      function f() {
        prove(['a', 'b'], function predicate(a, b) {
          return a === b;
        });
      }

      prove([f, "predicate(a = 'a', b = 'b');"], throws);
    });

    test('Fails with custom message.', function () {
      function f() {
        prove([true, false], function (a, b) {
          if (a === b) {
            return true;
          }

          throw new Error('${0} does not equal ${1}.');
        });
      }

      prove([f, Error, /does not equal/], throws);
    });

    test('Fails with custom arguments.', function () {
      function f() {
        prove([true, false], function (a, b) {
          if (a === b) {
            return true;
          }

          var error = new Error('${0} did not equal ${1} at ${2}.');
          error.argv = [a, b, new Date()];
          throw error;
        });
      }

      prove([f, Error, /did not equal \S+ at/], throws);
    });

    test('Manually fails.', function () {
      function f() {
        throw new Error('`f()` should not have been called.');
      }

      prove([f, Error, '`f()` should not have been called.'], throws);
    });

    test('Resolves.',
    function () {
      return prove([Promise.resolve()], resolves);
    });

    test('Resolves with predicate.',
    function () {
      return prove([Promise.resolve('resolution'), function (a) {
        return a === 'resolution';
      }], resolves);
    });

    test('Resolves with arguments and predicate.',
    function () {
      return prove([Promise.resolve('qwerty'), [/^qwerty$/], match], resolves);
    });

    test('Rejects with custom type.',
    function () {
      return prove([Promise.reject(new TypeError('!')), TypeError], rejects);
    });

    test('Rejects with custom message.',
    function () {
      return prove([Promise.reject(new Error('† Failed.')), '†'], rejects);
    });

    test('Rejects with custom type and message.',
    function () {
      var promise = Promise.reject(new TypeError('† Failed.'));
      return prove([promise, TypeError, '†'], rejects);
    });

    test('Rejection with mismatched type fails.',
    function () {
      var promise = Promise.reject(new Error('!'));
      promise = prove([promise, TypeError], rejects);

      return prove([promise, Error, /reject with reason [^"]/], rejects);
    });

    test('Rejection with mismatched message fails.',
    function () {
      var promise = Promise.reject(new Error('!'));
      promise = prove([promise, '¶'], rejects);

      return prove([promise, "reject with reason '"], rejects);
    });

    test('Rejection with mismatched type and message fails.',
    function () {
      var promise = Promise.reject(new Error('!'));
      promise = prove([promise, TypeError, '¶'], rejects);

      return prove([promise, Error, /reject with reason [^']+\s'/], rejects);
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
