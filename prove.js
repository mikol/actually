(function (context) {
/*jscs:disable validateIndentation*//*jscs:enable validateIndentation*/
// -----------------------------------------------------------------------------

'use strict';

var id = 'prove';
var dependencies = ['is'];

function factory(is) {
  /**
   * @private
   */
  function format(string, argv) {
    if (is.array(argv)) {
      argv = stringify(argv);
      return ('' + string).replace(/([^\\])?\$\{(\d+?)\}/g,
        function (m, $1, $2) {
          return (is.string($1) ? $1 : '') + stringify(argv[$2]);
        });
    }

    return string;
  }

  function isArrowFunction(string) {
    var arrowIndex = ~string.indexOf('=>'); // (0, -1, -2, ..., -n)
    var functionIndex = ~string.indexOf('function');

    return arrowIndex && (!functionIndex || arrowIndex > functionIndex);
  }

  function isNamedFunction(string) {
    return /^function\s[^\(\s]+\s?\(.*?\)\s?\{/.test(string);
  }

  function stringify(value) {
    if (is.string(value)) {
      return "'" + value + "'";
    } else if (is.function(value)) {
      return (value.name ? value.name + '()' : 'function ()');
    }

    return value;
  }

  /**
   * @private
   */
  function produce(argv, predicate, okay, message) {
    if (!okay) {
      if (is.nil(message)) {
        var infix = ('' + predicate).replace(/\s+/g, ' ');
        var matchedParameters;
        var parameters;
        var parametersString;
        var replaceRegExp;

        if (isArrowFunction(infix)) {
          matchedParameters = /^\(?(.*?)\)? ?=>/.exec(infix);
          replaceRegExp = /^().*?(\s?=>.*)$/;
        } else if (isNamedFunction(infix)) {
          infix = /^function ([^\( ]+\s?\(.*?\))/.exec(infix)[1] + ';';
          matchedParameters = /^[^\( ]+\((.*?)\);$/.exec(infix);
          replaceRegExp = /^([^\( ]+)\(.*?\)(;)$/;
        } else {
          matchedParameters = /^function \((.*?)\)/.exec(infix);
          replaceRegExp = /^(function )\(.*?\)(.*)$/;
        }

        parametersString = matchedParameters && matchedParameters[1] &&
            matchedParameters[1].replace(/^\s+|\s+$/g, '');

        parameters = parametersString ? parametersString.split(/,\s+/) : [];

        var x = 0;
        var nx = parameters.length;
        var pairs = [];

        for (; x < nx; ++x) {
          pairs.push(parameters[x] + ' = ' + stringify(argv[x]));
        }

        for (nx = argv.length; x < nx; ++x) {
          pairs.push(stringify(argv[x]));
        }

        message = 'Assertion failed. ' +
            infix.replace(replaceRegExp, '$1(' + pairs.join(', ') + ')$2');
      }

      throw new Error(message);
    }
  }

  /**
   * Throws an exception if invoking `predicate()` with the arguments listed in
   * `argv` returns either `false` or an `Error` object.
   *
   * If `predicate()` returns `false`, then an error will be thrown whose
   * message is inferred by coercing `predicate` to a string and replacing
   * occurrences of any parameters therein with the corresponding `argv`
   * values.
   *
   * Richer error messages can be crafted by returning an `Error` object from
   * `predicate()`. The object’s `message` property is assumed to be string
   * optionally formatted with `${n}` expressions (where `n` is the index of
   * the corresponding element in `argv`).
   *
   * If `predicate()` returns an `Error` object that includes an `argv`
   * property, this property will be used in place of the `argv` parameter
   * passed to `prove()`.
   *
   * @example
   * // Throws an exception unless the predicate `are.equal` holds true given
   * // the arguments `[actual, expected]`.
   * prove([actual, expected], are.equal);
   *
   * @example
   * // Error: Assertion failed. function (a = 'true', b = 'false') { return a
   * // === b; }
   * prove([true, false], function (a, b) {
   *   return a === b;
   * });
   *
   * @example
   * // Error: Assertion failed. `true` does not equal `false`.
   * prove([true, false], function (a, b) {
   *   if (a === b) {
   *     return true;
   *   }
   *
   *   throw new Error('${0} does not equal ${1}.');
   * });
   *
   * @example
   * // Error: Assertion failed. `true` did not equal `false` at "Wed Mar 09
   * // 2016 15:08:09 GMT-0800 (PST)".
   * prove([true, false], function eq(a, b) {
   *   if (a === b) {
   *     return true;
   *   }
   *
   *   var error = new Error('${0} did not equal ${1} at ${2}.');
   *   error.argv = [a, b, new Date()];
   *   throw error;
   * });
   *
   * @example
   * // Manually fail using the `Error` constructor as a predicate. Throws:
   * // Error('Assertion failed. `callback()` should not have been called.');
   * prove(['`callback()` should not have been called.'], Error);
   *
   * @param {Array.<*>} [argv=[]] - Arguments to apply to `predicate()`.
   * @param {function(...*): (boolean|Error)} predicate - A function that
   *     asserts something about the arguments in `argv`. `predicate()` can
   *     expect any number of arguments (including none at all) and should
   *     return `true` if what it asserts is verified; it should return `false`
   *     or throw an exception otherwise.
   *
   * @throws {Error} If `predicate()` returns `false` or throws an exception.
   */
  function prove(argv, predicate) {
    if (is.nil(predicate)) {
      predicate = argv;
      argv = [];
    }

    var message;
    var result = false;

    try {
      result = predicate.apply(undefined, argv);
    } catch (e) {
      message = 'Assertion failed. ' +
          format(e.message, is.array(e.argv) ? e.argv : argv);
    }

    if (is.promise(result)) {
      return result.then(function (value) {
        produce(argv, predicate, !!value, message);
      }, function (reason) {
        message = 'Assertion failed. ' +
            format(reason.message, is.array(reason.argv) ? reason.argv : argv);

        produce(argv, predicate, false, message);
      });
    } else {
      produce(argv, predicate, !!result, message);
    }
  }

  return prove;
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
