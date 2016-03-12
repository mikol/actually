(function (context) {
/*jscs:disable validateIndentation*//*jscs:enable validateIndentation*/
// -----------------------------------------------------------------------------

'use strict';

var id = '';
var dependencies = [
  'criteria',
  'matches',
  '../prove',
  '../rejects',
  '../resolves',
  '../throws'
];

function factory($0, matches, prove, rejects, resolves, throws) {
  /* globals scope, test */
  scope('`prove` Assertion Tests',
  function () {
    test('Passes.', function () {
      prove(function (a, b) {
        return a === b;
      }, true, true);
    });

    test('Fails.', function () {
      function f() {
        prove(function (a, b) {
          return a === b;
        }, true, false);
      }

      prove(throws, f);
    });

    test('Generic arrow predicate fails.', function () {
      function f() {
        prove(() => false);
      }

      prove(throws, '() => false', f);
    });

    test('Generic arrow predicate with argument fails.', function () {
      function f() {
        prove(() => false, 'a');
      }

      prove(throws, "('a') => false", f);
    });

    test('Generic arrow predicate with arguments fails.', function () {
      function f() {
        prove(() => false, 'a', 'b');
      }

      prove(throws, "('a', 'b') => false", f);
    });

    test('Generic arrow predicate with parameter fails.', function () {
      function f() {
        prove((a) => a !== a, 'a');
      }

      prove(throws, "(a = 'a') => a !== a", f);
    });

    test('Generic arrow predicate with some parameters fails.', function () {
      function f() {
        prove((a) => a !== a, 'a', 'b');
      }

      prove(throws, "(a = 'a', 'b') => a !== a", f);
    });

    test('Generic arrow predicate with parameters fails.', function () {
      function f() {
        prove((a, b) => a === b, 'a', 'b');
      }

      prove(throws, "(a = 'a', b = 'b') => a === b", f);
    });

    test('Generic predicate fails.', function () {
      function f() {
        prove(function () {
          return false;
        });
      }

      prove(throws, 'function () { return false; }', f);
    });

    test('Generic predicate with arguments fails.', function () {
      function f() {
        prove(function () {
          return false;
        }, 'a', 'b');
      }

      prove(throws, "function ('a', 'b') { return false; }", f);
    });

    test('Generic predicate with some parameters fails.', function () {
      function f() {
        prove(function (a) {
          return a !== a;
        }, 'a', 'b');
      }

      prove(throws, "function (a = 'a', 'b') { return a !== a; }", f);
    });

    test('Generic predicate with parameters fails.', function () {
      function f() {
        prove(function (a, b) {
          return a === b;
        }, 'a', 'b');
      }

      prove(throws, "function (a = 'a', b = 'b') { return a === b; }", f);
    });

    test('Generic named predicate fails.', function () {
      function f() {
        prove(function predicate() {
          return false;
        });
      }

      prove(throws, 'predicate();', f);
    });

    test('Generic named predicate with arguments fails.', function () {
      function f() {
        prove(function predicate() {
          return false;
        }, 'a', 'b');
      }

      prove(throws, "predicate('a', 'b');", f);
    });

    test('Generic named predicate with some parameters fails.', function () {
      function f() {
        prove(function predicate(a) {
          return a !== a;
        }, 'a', 'b');
      }

      prove(throws, "predicate(a = 'a', 'b');", f);
    });

    test('Generic named predicate with parameters fails.', function () {
      function f() {
        prove(function predicate(a, b) {
          return a === b;
        }, 'a', 'b');
      }

      prove(throws, "predicate(a = 'a', b = 'b');", f);
    });

    test('Fails with custom message.', function () {
      function f() {
        prove(function (a, b) {
          if (a === b) {
            return true;
          }

          throw new Error('${0} does not equal ${1}.');
        }, true, false);
      }

      prove(throws, Error, /does not equal/, f);
    });

    test('Fails with custom arguments.', function () {
      function f() {
        prove(function (a, b) {
          if (a === b) {
            return true;
          }

          var error = new Error('${0} did not equal ${1} at ${2}.');
          error.argv = [a, b, new Date()];
          throw error;
        }, true, false);
      }

      prove(throws, Error, /did not equal \S+ at/, f);
    });

    test('Manually fails.', function () {
      function f() {
        throw new Error('`f()` should not have been called.');
      }

      prove(throws, Error, '`f()` should not have been called.', f);
    });

    test('Resolves.',
    function () {
      return prove(resolves, Promise.resolve());
    });

    test('Resolves with predicate.',
    function () {
      return prove(resolves, function (a) {
        return a === 'resolution';
      }, Promise.resolve('resolution'));
    });

    test('Resolves with arguments and predicate.',
    function () {
      return prove(resolves, matches, /^qwerty$/, Promise.resolve('qwerty'));
    });

    test('Rejects with custom type.',
    function () {
      return prove(rejects, TypeError, Promise.reject(new TypeError('!')));
    });

    test('Rejects with custom message.',
    function () {
      return prove(rejects, '†', Promise.reject(new Error('† Failed.')));
    });

    test('Rejects with custom type and message.',
    function () {
      var promise = Promise.reject(new TypeError('† Failed.'));
      return prove(rejects, TypeError, '†', promise);
    });

    test('Rejection with mismatched type fails.',
    function () {
      var promise = Promise.reject(new Error('!'));
      promise = prove(rejects, TypeError, promise);

      return prove(rejects, Error, /reject with reason [^"]/, promise);
    });

    test('Rejection with mismatched message fails.',
    function () {
      var promise = Promise.reject(new Error('!'));
      promise = prove(rejects, '¶', promise);

      return prove(rejects, "reject with reason '", promise);
    });

    test('Rejection with mismatched type and message fails.',
    function () {
      var promise = Promise.reject(new Error('!'));
      promise = prove(rejects, TypeError, '¶', promise);

      return prove(rejects, Error, /reject with reason [^']+\s'/, promise);
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
