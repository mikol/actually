(function (context) {
/*jscs:disable validateIndentation*//*jscs:enable validateIndentation*/
// -----------------------------------------------------------------------------

'use strict';

var id = '';
var dependencies = [
  'criteria',
  'matches',
  '../actually',
  '../rejects',
  '../resolves',
  '../throws'
];

function factory($0, matches, actually, rejects, resolves, throws) {
  /* globals scope, test */
  scope('`actually` Assertion Tests',
  function () {
    test('Boolean predicate passes.', function () {
      actually(true);
    });

    test('Boolean predicate fails.', function () {
      function f() {
        return actually(false);
      }

      actually(throws, f);
    });

    test('Function predicate passes.', function () {
      actually(function (a, b) {
        return a === b;
      }, true, true);
    });

    test('Function is reported correctly when it does not throw as expected.',
    function () {
      function callee(a) { return a; }

      function caller() {
        actually(throws, callee);
      }

      actually(throws, 'Expected callee() to throw an exception.', caller);
    });

    test('Function predicate fails.', function () {
      function f() {
        actually(function (a, b) {
          return a === b;
        }, true, false);
      }

      actually(throws, f);
    });

    test('Generic arrow predicate fails.', function () {
      function f() {
        actually(() => false);
      }

      actually(throws, '() => false', f);
    });

    test('Generic arrow predicate with argument fails.', function () {
      function f() {
        actually(() => false, 'a');
      }

      actually(throws, "('a') => false", f);
    });

    test('Generic arrow predicate with arguments fails.', function () {
      function f() {
        actually(() => false, 'a', 'b');
      }

      actually(throws, "('a', 'b') => false", f);
    });

    test('Generic arrow predicate with parameter fails.', function () {
      function f() {
        actually((a) => a !== a, 'a');
      }

      actually(throws, "(a = 'a') => a !== a", f);
    });

    test('Generic arrow predicate with some parameters fails.', function () {
      function f() {
        actually((a) => a !== a, 'a', 'b');
      }

      actually(throws, "(a = 'a', 'b') => a !== a", f);
    });

    test('Generic arrow predicate with parameters fails.', function () {
      function f() {
        actually((a, b) => a === b, 'a', 'b');
      }

      actually(throws, "(a = 'a', b = 'b') => a === b", f);
    });

    test('Generic predicate fails.', function () {
      function f() {
        actually(function () {
          return false;
        });
      }

      actually(throws, 'function () { return false; }', f);
    });

    test('Generic predicate with arguments fails.', function () {
      function f() {
        actually(function () {
          return false;
        }, 'a', 'b');
      }

      actually(throws, "function ('a', 'b') { return false; }", f);
    });

    test('Generic predicate with some parameters fails.', function () {
      function f() {
        actually(function (a) {
          return a !== a;
        }, 'a', 'b');
      }

      actually(throws, "function (a = 'a', 'b') { return a !== a; }", f);
    });

    test('Generic predicate with parameters fails.', function () {
      function f() {
        actually(function (a, b) {
          return a === b;
        }, 'a', 'b');
      }

      actually(throws, "function (a = 'a', b = 'b') { return a === b; }", f);
    });

    test('Generic named predicate fails.', function () {
      function f() {
        actually(function predicate() {
          return false;
        });
      }

      actually(throws, 'predicate();', f);
    });

    test('Generic named predicate with arguments fails.', function () {
      function f() {
        actually(function predicate() {
          return false;
        }, 'a', 'b');
      }

      actually(throws, "predicate('a', 'b');", f);
    });

    test('Generic named predicate with some parameters fails.', function () {
      function f() {
        actually(function predicate(a) {
          return a !== a;
        }, 'a', 'b');
      }

      actually(throws, "predicate(a = 'a', 'b');", f);
    });

    test('Generic named predicate with parameters fails.', function () {
      function f() {
        actually(function predicate(a, b) {
          return a === b;
        }, 'a', 'b');
      }

      actually(throws, "predicate(a = 'a', b = 'b');", f);
    });

    test('Fails with custom message.', function () {
      function f() {
        actually(function (a, b) {
          if (a === b) {
            return true;
          }

          throw new Error('${0} does not equal ${1}.');
        }, true, false);
      }

      actually(throws, Error, /does not equal/, f);
    });

    test('Fails with custom arguments.', function () {
      function f() {
        actually(function (a, b) {
          if (a === b) {
            return true;
          }

          var error = new Error('${0} did not equal ${1} at ${2}.');
          error.argv = [a, b, new Date()];
          throw error;
        }, true, false);
      }

      actually(throws, Error, /did not equal \S+ at/, f);
    });

    test('Manually fails.', function () {
      function f() {
        throw new Error('`f()` should not have been called.');
      }

      actually(throws, Error, '`f()` should not have been called.', f);
    });

    test('Resolves.',
    function () {
      return actually(resolves, Promise.resolve());
    });

    test('Resolves with predicate.',
    function () {
      return actually(resolves, function (a) {
        return a === 'resolution';
      }, Promise.resolve('resolution'));
    });

    test('Resolves with arguments and predicate.',
    function () {
      return actually(resolves, matches, /^qwerty$/, Promise.resolve('qwerty'));
    });

    test('Rejects with custom type.',
    function () {
      return actually(rejects, TypeError, Promise.reject(new TypeError('!')));
    });

    test('Rejects with custom message.',
    function () {
      return actually(rejects, '†', Promise.reject(new Error('† Failed.')));
    });

    test('Rejects with custom type and message.',
    function () {
      var promise = Promise.reject(new TypeError('† Failed.'));
      return actually(rejects, TypeError, '†', promise);
    });

    test('Rejection with mismatched type fails.',
    function () {
      var promise = Promise.reject(new Error('!'));
      promise = actually(rejects, TypeError, promise);

      return actually(rejects, Error, /reject with reason [^"]/, promise);
    });

    test('Rejection with mismatched message fails.',
    function () {
      var promise = Promise.reject(new Error('!'));
      promise = actually(rejects, '¶', promise);

      return actually(rejects, "reject with reason '", promise);
    });

    test('Rejection with mismatched type and message fails.',
    function () {
      var promise = Promise.reject(new Error('!'));
      promise = actually(rejects, TypeError, '¶', promise);

      return actually(rejects, Error, /reject with reason [^']+\s'/, promise);
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
